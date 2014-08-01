/**
 * aspen.js
 *
 * Main API for navigating/modifying history trees.
 */

var fs = require('fs');
var request = require('request');
var model = require('./model');

function getOne(query, args, msg, callback) {
    model.execute(query, args, function(err, result) {
        if (err || result.length === 0) {
            callback(msg);
        } else {
            callback(false, result[0]);
        }
    });
}

function getService(projectId, callback) {
    getOne('select url from Projects where id = ?',
            [projectId], 'Error: project not found.', function(err, result) {
        var url = result.url + '/';
        callback(false, {
            save: function(callback) {
                request.post({url: url + 'save'});
            },
            load: function(stateData) {
                request.post({url: url + 'load', json: {state: stateData}});
            }
        });
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

function addState(projectId, state, name, icon, callback) {
    getCurrentStateId(projectId, function(err, currentStateId) {
        model.executeGet('insert into States (projectId, parentId, name, icon) '
                + 'values (?, ?, ?, ?)',
                [projectId, currentStateId, name, icon],
                function(err, newStateId) {
            updateCurrentStateId(projectId, newStateId, function(err) {
                var path = 'objects/' + newStateId;
                model.execute('update States set path = ? where id = ?',
                        [path, newStateId], function(err) {});
                fs.writeFile(path, state, 'utf8', function(err) {
                    callback(err, newStateId);
                });
            });
        });
    });
}

function getStateObjs(projectId, callback) {
    model.execute('select id, path, parentId, name, icon, timestamp '
            + 'from States where projectId = ?', [projectId], callback);
}

function addProject(name, url, callback) {
    model.executeGet('insert into Projects (name, url) values (?, ?)',
            [name, url], callback);
}

function getProject(projectId, callback) {
    getOne('select id, name from Projects where id = ?',
            [projectId], 'Error: project not found.', callback);
}

function getProjects(callback) {
    model.execute('select id, name from Projects', [], callback);
}

function requestSave(projectId, callback) {
    getService(projectId, function(err, service) {
        service.save(callback);
    });
}

function save(projectId, state, name, icon, callback) {
    addState(projectId, state, name, icon, callback);
}

function load(projectId, stateId, callback) {
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
        load(projectId, stateId, callback);
    });
}

exports.getState = getState;
exports.getStateObjs = getStateObjs;
exports.getProject = getProject;
exports.getProjects = getProjects;
exports.requestSave = requestSave;
exports.save = save;
exports.load = load;
exports.startProject = startProject;
exports.loadProject = loadProject;

