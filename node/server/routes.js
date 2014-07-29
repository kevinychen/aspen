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

exports.getState = function(req, res) {
    pando.getState(req.params.stateId, function(err, state) {
        res.json({error: err, data: state});
    });
}

