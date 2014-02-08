"use strict";

String.prototype.trunc = String.prototype.trunc || function(n) {
    return this.length > n ? this.substr(0, n - 1) + "&hellip;" : this;
};

var mongoose = require("mongoose");

var autoIncrement = require("mongoose-auto-increment");

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var md = require("node-markdown").Markdown;

var pageModel = function() {
    var pageSchema = new Schema({
        timestamp: {
            type: Date,
            "default": Date.now
        },
        type: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        summary: {
            type: String
        },
        title: {
            type: String,
            required: true
        },
        format: {
            type: String
        }
    });
    pageSchema.plugin(autoIncrement.plugin, {
        model: "Page",
        startAt: 1
    });
    pageSchema.methods.render = function() {
        return md(this.content);
    };
    pageSchema.methods.get_summary = function() {
        return md(this.summary || text_summary(this.content));
    };
    return mongoose.model("Page", pageSchema);
};

//This below method is borrowed from drupal's text_summary method.
//I stared at a printout and took what was useful, rewriting each piece from scratch.
var text_summary = function(text) {
    var size = 600;
    var delimiter = text.indexOf("<!-- break -->");
    if (delimiter >= 0) {
        return text.substring(0, delimiter);
    }
    if (size > text.length) {
        return text;
    }
    //now it gets fun
    var summary = text.trunc(size);
    var specials = [ "\n", ".", "?", "!" ];
    var rval = null;
    specials.forEach(function(s) {
        var test = summary.lastIndexOf(s);
        if (test > 0) {
            rval = rval || summary.substring(0, test);
        }
    });
    return rval || summary;
};

module.exports = new pageModel();