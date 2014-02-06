/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';


var app = require('../coderis'),
    kraken = require('kraken-js'),
    request = require('supertest'),
    assert = require('assert');


describe('index', function () {

    var mock;


    beforeEach(function (done) {
        kraken.create(app).listen(function (err, server) {
            mock = server;
            done(err);
        });
    });


    afterEach(function (done) {
        mock.close(done);
    });


    it('should say "hello"', function (done) {
        request(mock)
            .get('/')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/coderis.me/)
            .end(function(err, res){
                done(err);
            });
    });

});
