var aspen = require('./aspen');
var socketio = require('./socketio');

function refreshProject(projectId) {
    aspen.getStateObjs(projectId, function(err, states) {
        socketio.broadcastTo(projectId, 'tree', states);
    });
}

exports.setServer = function(server) {
    socketio.setServer(server, refreshProject);
}

exports.home = function(req, res) {
    res.render('index.html');
}

exports.main = function(req, res) {
    var projectId = req.params.projectId;
    aspen.getProject(projectId, function(err, result) {
        res.render('main.html', {projectId: projectId, name: result.name});
    });
}

exports.projects = function(req, res) {
    aspen.getProjects(function(err, projects) {
        res.json({error: err, projects: projects});
    });
}

exports.getState = function(req, res) {
    aspen.getState(req.params.stateId, function(err, state) {
        res.json({error: err, data: state});
    });
}

exports.requestSave = function(req, res) {
    aspen.requestSave(req.body.projectId, function(err) {
        res.json({error: err});
    });
}

exports.save = function(req, res) {
    var projectId = req.body.projectId;
    aspen.save(projectId, req.body.state, function(err, stateId) {
        refreshProject(projectId);
        res.json({error: err, stateId: stateId});
    });
}

exports.load = function(req, res) {
    aspen.load(req.body.projectId, req.body.stateId, function(err) {
        res.json({error: err});
    });
}

