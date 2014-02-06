"use strict";

var Cookie = require("cookies");

var cookieModel = function() {
    var helper = function(name) {
        return {
            get: function() {
                return cookieData.cookies.get(name, {
                    signed: true
                });
            },
            set: function(val, opt) {
                opt = opt || {};
                opt.signed = true;
                cookieData.cookies.set(name, val, opt);
            }
        };
    };
    var keys = [ "key", "permanent_login" ];
    var cookieData = {
        init: function(req, res, next) {
            cookieData.req = req;
            cookieData.res = res;
            cookieData.cookies = new Cookie(req, res, keys);
            if (next) {
                next();
            }
        },
        key: helper("key"),
        permanent_login: helper("permanent_login"),
        permanent: {
            maxage: 3155692597470
        }
    };
    return cookieData;
};

module.exports = cookieModel();