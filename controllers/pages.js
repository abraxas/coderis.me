'use strict';


var Page = require('../models/page');


module.exports = function (app) {

    var model = new Page();


    app.get('/pages/:type', function (req, res) {
        
        res.format({
            json: function () {
                res.json(model);
            },
            html: function () {
                res.render('index', model);
            }
        });
    });

    var page_helper = function(p,req,res) {
      var model = {};
      model.active_tab = p;      
      Page.find({type: p},function(err,pages) {
        model.pages = pages;
        res.render('index',model);
      });
    }

    app.get('/blog',function(req,res) {
      page_helper('blog',req,res);
    });
    app.get('/articles',function(req,res) {
      page_helper('articles',req,res);
    });


    app.get('/page/new', function(req,res) {
      res.render('page/new', {});      
    });

    app.post('/page/new', function(req,res) {
      Page.create(req.body,function(err,pagesaved) {
          console.log("SAVED? " + err + " | " + pagesaved);
          res.redirect('/page/' + page.type + "/" + page.id);
      });
    });

    app.get('/page/edit/:id', function(req,res) {
      Page.findById(req.params.id,function(err,page) {
        res.format({
            json: function () {
                if(err) {
                  res.json({error: err});
                } else {
                  res.json(page);
                }
            },
            html: function () {
            //  err = null;
              //page = { title: 'test', content: 'test' };
                if(err) {              
                  res.send(500,err);
                } 
                else {
                  res.render('page/edit', page);
                }
            }
        });
      })
    });
    app.post('/page/edit/:id', function(req,res) {
      Page.findById(req.params.id,function(err,page) {
        console.log("SAVE? " + err + " | " + page);
        page.title = req.body.title;
        page.content = req.body.content;
        page.type = req.body.type;
        console.log("SAVE? " + err + " | " + page);
        page.save(function(err,pagesaved) {
          console.log("SAVED? " + err + " | " + pagesaved);
          res.redirect('/page/' + page.type + "/" + page.id);
        });
      })
    });    

    app.get('/page/:type/:id',function (req,res) {
      Page.findById(req.params.id,function(err,page) {
        res.format({
            json: function () {
                if(err) {
                  res.json({error: err});
                } else {
                  res.json(page);
                }
            },
            html: function () {
            //  err = null;
              //page = { title: 'test', content: 'test' };
                if(err) {              
                  res.send(500,err);
                } 
                else {
                  res.render('page', page);
                }
            }
        });

      });
    });

};
