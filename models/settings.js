"use strict";

var mongoose = require("mongoose"), Schema = mongoose.Schema;

var uuid = require("node-uuid");
var crypto = require("crypto");

var hash = function (passwd, salt) {
    return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
};

var settingsModel = function() {
    var settingsSchema = new Schema({
        admin_key: {
            type: String
        },
        username: {
             type: String
        },
        hashed_password: {
             type: String
        },
        salt: {
             type: String,
             default: uuid.v1
        },
    });
    settingsSchema.methods.setPassword = function (pass) {
        this.salt = uuid.v1();
        this.hashed_password = hash(pass, this.salt);
    };
    settingsSchema.static("get", function(callback) {
        this.findOne({}, function(err, settings) {
            if (settings) {
                return callback(settings);
            } else {
                mongoose.model("Settings").create({}, function(err, settings) {
                    return callback(settings);
                });
            }
        });
    });
    return mongoose.model("Settings", settingsSchema);

};

module.exports = new settingsModel();
