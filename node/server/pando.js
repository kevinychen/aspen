/**
 * pando.js
 *
 * Main API for navigating/modifying history trees.
 */

var model = require('./model');

/*
 * MFD
 * Mock service
 */
var mockService = new Object();
var mockProjectHash = 0, mockStateHash = 0;
mockService.startProject = function(projectName, callback) {
    mockProjectHash++; mockStateHash++;
    callback(false, mockProjectHash, mockStateHash);
}
mockService.save = function(projectHash, callback) {
    mockStateHash++;
    callback(false, mockStateHash);
}
mockService.get = function(projectHash, stateHash) {}


function getProjectHash(projectId, callback) {
    model.execute('select projectHash from Projects where id = ?', [projectId],
            function(err, result) {
        if (err || result.length === 0) {
            callback('Error: project not found.');
        } else {
            callback(false, result[0].projectHash);
        }
    });
}

function updateCurrent(projectId, currentStateHash) {
    model.execute('update States set isCurrent = IF(projectId = ?, IF(stateHash = ?, 1, 0), isCurrent)',
            [projectId, currentStateHash], function(err) {});
}

function addState(projectId, stateHash) {
    model.execute('select stateHash from States where projectId = ? and isCurrent = 1',
            [projectId], function(err, result) {
        var parentHash = result.length === 0 ? null : result[0].stateHash;
        model.execute('insert into States (stateHash, projectId, parentHash) values (?, ?, ?)',
                [stateHash, projectId, parentHash], function(err) {
            updateCurrent(projectId, stateHash);
        });
    });
}

function save(service, projectId) {
    getProjectHash(projectId, function(err, projectHash) {
        mockService.save(projectHash, function(err, stateHash) {
            addState(projectId, stateHash);
        });
    });
}

function get(service, projectId, stateHash, callback) {
    getProjectHash(projectId, function(err, projectHash) {
        mockService.get(projectHash, stateHash);
        updateCurrent(projectId, stateHash);
    });
}

function startProject(serviceUrl, projectName, callback) {
    mockService.startProject(projectName, function(err, projectHash, stateHash) {
        model.execute('insert into Projects (name, serviceUrl, projectHash) values (?, ?, ?)',
                [projectName, serviceUrl, projectHash], function(err) {
            model.execute('select last_insert_id() as projectId', [], function(err, result) {
                var projectId = result[0].projectId;
                addState(projectId, stateHash);
                callback(err, projectId);
            });
        });
    });
}

function loadProject(serviceUrl, projectId, callback) {
    model.execute('select stateId from States where projectId = ? and isCurrent = 1',
            function(err, stateIds) {
        if (err || stateIds.length === 0) {
            callback('Error: loaded project not found.');
        } else {
            mockService.get(projectId, stateIds[0].stateId);
        }
    });
}

exports.save = save;
exports.get = get;
exports.startProject = startProject;
exports.loadProject = loadProject;

/*
 * MFD
 * Test code
 */
startProject('service.com', 'test', function(err, projectId) {
    save('service.com', projectId);
    startProject('next.com', 'duo', function(err, projectId2) {
        loadProject('service.com', projectId, function() {
            save('service.com', projectId);
        });
    });
});

