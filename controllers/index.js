"use strict";

var IndexModel = require("../models/index");

var Page = require("../models/page");

module.exports = function(app) {
    var model = new IndexModel();
    app.get("/", function(req, res) {
        model = {};
        model.active_tab = "home";
        Page.find({}, function(err, pages) {
            model.pages = pages;
            res.render("index", model);
        });
    });
};