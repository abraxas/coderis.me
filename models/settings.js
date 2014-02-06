"use strict";

var mongoose = require("mongoose"), Schema = mongoose.Schema;

var uuid = require("node-uuid");

var settingsModel = function() {
    var settingsSchema = new Schema({
        admin_key: {
            type: String
        }
    });
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