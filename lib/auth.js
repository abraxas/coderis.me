"use strict";

var Settings = require("../models/settings");

var Cookie = require("../models/cookie");

var crypto = require("crypto");

var hash = function(passwd, salt) {
    return crypto.createHmac("sha256", salt).update(passwd).digest("hex");
};

var authconf = {};

var config = function(conf) {
    authconf = conf;
};

var authenticate = function(req, res, form) {
    var username = form.username;
    var password = form.password;
    var keepalive = form.keep_logged_in;
    console.log("AUTHIFY");
    Settings.get(function(settings) {
        var match = 1;
        console.log("setu " + settings.username);
        //automatically validate until user and pass are defined...
        //basically, you're god until you exist
        if (settings.username && settings.hashed_password && settings.salt) {
            if (settings.username !== username) {
                match = 0;
            }
            var hash_pass = hash(password, settings.salt);
            if (hash_pass !== settings.hashed_password) {
                match = 0;
            }
        }
        console.log("MATCHME " + match);
        if (match) {
            req.session.authenticated = 1;
            if (keepalive !== "") {
                req.session.cookie.maxAge = keepalive;
                req.session.cookie.expires = new Date(Date.now() + keepalive);
            }
            req.session.save();
            return true;
        } else {
            return false;
        }
    });
};

var middleware = function(req, res, next) {
    if (authconf.always_admin || req.session && req.session.authenticated) {
        req.authenticated = 1;
        console.log("LOCALZ");
        res.locals.admin = res.locals.auth = res.locals.authenticated = 1;
    }
    next();
};

var authorize = function(req, res, next) {
    if (req.authenticated) {
        return next();
    } else {
        return res.send(401, "Access Denied");
    }
};

var logout = function(req, res) {
    req.session.authenticated = null;
    req.session.save();
};

var auth = {
    config: config,
    authenticate: authenticate,
    middleware: middleware,
    logout: logout,
    authorize: authorize
};

module.exports = auth;