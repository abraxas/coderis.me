'use strict';

String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return this.length>n ? this.substr(0,n-1)+'&hellip;' : this;
      };

var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var md = require("node-markdown").Markdown;

var pageModel = function() {
  var pageSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    type: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },    
    title: { type: String, required: true },
    format: { type: String} 
  });

  pageSchema.plugin(autoIncrement.plugin, {
        model: "Page",
        startAt: 1
    });

  pageSchema.methods.render = function() {
    return md(this.content);
  }

  pageSchema.methods.get_summary = function() {
    return this.summary || md(this.content.trunc(250));
  }

  return mongoose.model("Page", pageSchema);
};


module.exports = new pageModel()