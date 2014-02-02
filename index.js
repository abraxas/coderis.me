'use strict';


var kraken = require('kraken-js'),
    db = require("./lib/database"), 
    auth = require("./lib/auth"),     
    app = {};

var Cookie = require("./models/cookie");    


app.configure = function configure(nconf, next) {
    db.config(nconf.get("databaseConfig"));  
    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    server.locals.active_tab = 'home';
    server.use(Cookie.init);  
    server.use(auth.middleware);
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
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
