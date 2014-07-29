/**
 * pando.js
 *
 * Main API for navigating/modifying history trees.
 */

var fs = require('fs');
var request = require('request');
var model = require('./model');

function getService(url, callback) {
    callback(false, {
        save: function(callback) {
            request.get({url: url + '/save'}, function(err, res, body) {
                callback(err, body && body.data);
            });
        },
        load: function(stateData) {
            request.post({url: url + '/load', body: stateData});
        }
    });
}

function getOne(query, args, msg, callback) {
    model.execute(query, args, function(err, result) {
        if (err || result.length === 0) {
            callback(msg);
        } else {
            callback(false, result[0]);
        }
    });
}

function getCurrentStateId(projectId, callback) {
    getOne('select currentStateId from Projects where id = ?',
            [projectId], 'Error loading project state.', function(err, result) {
        callback(err, result.currentStateId);
    });
}

function updateCurrentStateId(projectId, currentStateId, callback) {
    model.execute('update Projects set currentStateId = ? where id = ?',
            [currentStateId, projectId], callback);
}

function getState(stateId, callback) {
    getOne('select path from States where id = ?',
            [stateId], 'Error loading project state.', function(err, result) {
        fs.readFile(result.path, 'utf8', callback);
    });
}

function addState(projectId, state, callback) {
    getCurrentStateId(projectId, function(err, currentStateId) {
        model.executeGet('insert into States (projectId, parentId) values (?, ?)',
                [projectId, currentStateId], function(err, newStateId) {
            updateCurrentStateId(projectId, newStateId, function(err) {
                var path = '../objects/' + newStateId;
                model.execute('update States set path = ? where id = ?',
                        [path, newStateId], function(err) {});
                fs.writeFile(path, state, 'utf8', function(err) {
                    callback(err, newStateId);
                });
            });
        });
    });
}

function addProject(name, url, callback) {
    model.executeGet('insert into Projects (name, url) values (?, ?)',
            [name, url], callback);
}

function save(projectId, callback) {
    getService(projectId, function(err, service) {
        service.save(function(err, state) {
            addState(projectId, state, callback);
        });
    });
}

function get(projectId, stateId, callback) {
    updateCurrentStateId(projectId, stateId, function(err) {
        getService(projectId, function(err, service) {
            getState(stateId, function(err, state) {
                service.load(state);
                callback(err);
            });
        });
    });
}

function startProject(projectName, projectUrl, callback) {
    addProject(projectName, projectUrl, function(err, projectId) {
        save(projectId, function(err, stateId) {
            callback(err, projectId, stateId);
        });
    });
}

function loadProject(projectId, callback) {
    getCurrentStateId(projectId, function(err, stateId) {
        get(projectId, stateId, callback);
    });
}

exports.save = save;
exports.get = get;
exports.startProject = startProject;
exports.loadProject = loadProject;

