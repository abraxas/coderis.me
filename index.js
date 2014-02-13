'use strict';


var kraken = require('kraken-js'),
    db = require("./lib/database"), 
    auth = require("./lib/auth"),     
    app = {};

var Cookie = require("./models/cookie");    


app.configure = function configure(nconf, next) {
    db.config(nconf.get("databaseConfig"));  
    auth.config(nconf.get("authConfig"));  
    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    server.locals.active_tab = 'home';
    server.use(Cookie.init);  
    // Run before most express middleware has been registered.
    server.use(function(req,res,next) {
      res.locals.node_env = process.env.NODE_ENV;
      next();
    });
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    server.use(auth.middleware);
    // Run before any routes have been added.
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
    kraken.create(app).listen(function (err) {
        if (err) {
            console.error(err.stack);
        }
    });
}


module.exports = app;
