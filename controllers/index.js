'use strict';


var IndexModel = require('../models/index');
var Page = require('../models/page');


module.exports = function (app) {

    var model = new IndexModel();


    app.get('/', function (req, res) {
        model = {};      
        Page.find({},function(err,pages) {          

          model.pages = pages;
          res.render('index', model);
        });
        
    });

};
