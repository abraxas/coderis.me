"use strict";

var Page = require("../models/page");

var authorize = require("../lib/auth").authorize;

module.exports = function(app) {
    var model = new Page();
    var page_helper = function(p, req, res) {
        var model = {};
        model.active_tab = p;
        Page.find({
            type: p
        }, function(err, pages) {
            model.pages = pages;
            res.render("index", model);
        });
    };
    app.get("/blog", function(req, res) {
        page_helper("blog", req, res);
    });
    app.get("/articles", function(req, res) {
        page_helper("articles", req, res);
    });
    app.get("/page/new", authorize, function(req, res) {
        res.render("page/new", {});
    });
    app.post("/page/new", authorize, function(req, res) {
        Page.create(req.body, function(err, pagesaved) {
            console.log("SAVED? " + err + " | " + pagesaved);
            res.redirect("/page/" + pagesaved.id);
        });
    });
    
    var view_page = function(req, res, err, page) {
        res.format({
            json: function() {
                if (err) {
                    res.json({
                        error: err
                    });
                } else {
                    res.json(page);
                }
            },
            html: function() {
                if (err) {
                    res.send(500, err);
                } else {
                    res.render("page", page);
                }
            }
        });
    };
    var get_page = function(req, res) {
        Page.findById(req.params.id, function(err, page) {
            view_page(req, res, err, page);
        });
    };
    app.get("/page/:id", get_page);
    app.get(/^.*$/, function(req, res, next) {
        var uri = req.path;
        console.log("OORI = " + uri);
        Page.findOne({
            route: uri
        }, function(err, page) {
            console.log("ERR IS: " + err);
            console.log("PAGE IS: " + page);
            if (!page) {
                next();
            } else {
                view_page(req, res, err, page);
            }
        });
    });
};
