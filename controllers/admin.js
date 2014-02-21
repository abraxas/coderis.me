"use strict";

var Settings = require("../models/settings");

var Page = require("../models/page");

var Cookie = require("../models/cookie");

var uuid = require("node-uuid");

var auth = require("../lib/auth");

var authorize = auth.authorize;

var authenticate = auth.authenticate;

var logout = auth.logout;

module.exports = function(app) {
    app.get("/admin/claim", function(req, res) {
        Settings.get(function(settings) {
            var mykey = Cookie.key.get();
            if (mykey) {
                console.log("My Key = " + mykey);
            }
            if (settings.admin_key) {
                console.log("ALREADY CLAIMED " + settings.admin_key);
                if (Cookie.key.get() && Cookie.key.get() === settings.admin_key) {
                    return res.send("You have already claimed this code.  You can change or get the key from settings, if you need.");
                } else {
                    return res.redirect("/");
                }
            } else {
                var key = uuid.v4();
                settings.admin_key = key;
                settings.save(function() {
                    res.send("Your new admin key is: " + key + ".  Do not lose it.");
                    Cookie.key.set(key, Cookie.permanent);
                });
            }
        });
    });
    /*
     app.get("/admin/auth/:uuid", function(req, res) {
        Cookie.key.set(req.params.uuid, Cookie.permanent);
        res.redirect("/admin/settings");
    });
     */
    app.get("/admin/login", function(req, res) {
        res.render("admin/login");
    });
    app.post("/admin/login", function(req, res) {
        authenticate(req, res, req.body);
        res.redirect("/admin/settings");
    });
    app.get("/admin/logout", function(req, res) {
        logout(req, res);
        res.redirect("/");
    });
    app.get("/admin/settings", authorize, function(req, res) {
        res.locals.active_tab = "settings";
        var model = {};
        Settings.get(function(settings_data) {
            model.settings_data = settings_data;
            res.render("admin/settings", model);
        });
    });
    app.post("/admin/admin_profile", function(req, res) {
        Settings.get(function(settings) {
            var frm = req.body;
            if (frm.password !== "" && frm.password === frm.confirm_password) {
                settings.setPassword(frm.password);
            }
            settings.username = frm.username;
            settings.save(function(err, s) {
                if (err) {
                    res.send(500, err);
                } else {
                    res.redirect("/admin/settings");
                }
            });
        });
    });
    app.get("/admin", function(req, res) {
        res.format({
            json: function() {
                res.json({});
            },
            html: function() {
                res.render("admin", {});
            }
        });
    });
    app.get("/admin/pages", function(req, res) {
        var model = {};
        res.locals.active_tab = "pages";
        Page.find({}, function(err, pages) {
            model.pages = pages;
            res.render("admin/pages", model);
        });
    });
    app.get("/admin/pages/:id/edit", authorize, function(req, res) {
        Page.findById(req.params.id, function(err, page) {
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
                        res.render("page/edit", page);
                    }
                }
            });
        });
    });
    app.post("/admin/pages/:id/delete", authorize, function(req, res) {
        Page.remove({
            _id: req.params.id
        }, function(err) {
            res.redirect("/admin/pages");
        });
    });
    app.post("/admin/pages/:id/edit", authorize, function(req, res) {
        Page.findById(req.params.id, function(err, page) {
            console.log("SAVE? " + err + " | " + page);
            page.title = req.body.title;
            page.content = req.body.content;
            page.type = req.body.type;
            page.route = req.body.route;
            page.front_page = req.body.front_page;
            console.log("SAVE? " + err + " | " + page);
            page.save(function(err, pagesaved) {
                console.log("SAVED? " + err + " | " + pagesaved);
                res.redirect("/page/" + page.id);
            });
        });
    });
};
