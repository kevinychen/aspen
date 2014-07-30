var thisio;
var clientMap = new Object();

exports.broadcastTo = function(projectId, title, data) {
    for (var socketId in clientMap[projectId]) {
        clientMap[projectId][socketId].emit(title, data);
    }
}

exports.setServer = function(server, init) {
    thisio = require('socket.io').listen(server);

    thisio.sockets.on('connection', function(socket) {
        socket.on('projectId', function(projectId) {
            if (!(projectId in clientMap)) {
                clientMap[projectId] = new Object();
            }
            clientMap[projectId][socket.id] = socket;
            init(projectId);
        });
        socket.on('disconnect', function () {
            for (projectId in clientMap) {
                delete clientMap[projectId][socket.id];
            }
        });
    });
}

