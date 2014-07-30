var pando = require('./pando');

exports.home = function(req, res) {
    res.render('index.html');
}

exports.main = function(req, res) {
    var projectId = req.params.projectId;
    pando.getStateObjs(projectId, function(err, states) {
        res.render('main.html', {projectId: projectId, states: states});
    });
}

exports.getStateObjs = function(req, res) {
    pando.getStateObjs(req.params.projectId, function(err, states) {
        res.json({error: err, data: states});
    });
}

exports.getState = function(req, res) {
    pando.getState(req.params.stateId, function(err, state) {
        res.json({error: err, data: state});
    });
}

exports.save = function(req, res) {
    pando.save(req.body.projectId, function(err, stateId) {
        res.json({error: err, stateId: stateId});
    });
}

exports.load = function(req, res) {
    pando.load(req.body.projectId, req.body.stateId, function(err) {
        res.json({error: err});
    });
}

