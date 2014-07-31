// $ node app 8091 1 http://localhost:8080/ aspen.txt

var express = require('express');
var http = require('http');
var request = require('request');
var Model = require('./Model').Model;

var port = process.argv[2] || '8080';
var projectId = process.argv[3];
var masterUrl = process.argv[4] || 'http://localhost:8080/';

var master = {
    save: function(data) {
        request.post({
            url: masterUrl + 'save',
            json: {projectId: projectId, state: data}
        });
    },
    load: function(stateId, callback) {
        request.post({
            url: masterUrl + 'load',
            json: {projectId: projectId, stateId: stateId}
        }, callback);
    }
};
var model = new Model(master, process.argv.slice(5));

var app = express();
app.use(express.bodyParser());
app.use(express.logger('dev'));

app.post('/save', function(req, res) {
    model.save();
    res.end();
});
app.post('/load', function(req, res) {
    model.load(req.body.state, function(err) {
        res.end();
    });
});

http.createServer(app).listen(port);

