"use strict";

var Settings = require('../models/settings');
var Cookie = require('../models/cookie');

var auth = function() {
    return {
        middleware: function(req,res,next) {
          Settings.get(function(settings) {
              var authkey = Cookie.key.get();
              if(settings.admin_key && settings.admin_key == authkey) {
                  console.log("Administrator Status Verified");
                  req.admin = 1;
              }
              next();
          });
        },
        admin_only: function(req,res,next) {
            if(req.admin) {
                return next();
            }
            else {
                return res.send(401,'Access Denied');
            }
        }     
    };
};

module.exports = auth();
