function Model(master, args) {
    this.master = master;
}

Model.prototype.setServer = function(server, projectId) {
    var thisio = require('socket.io').listen(server);
    var me = this;

    thisio.on('connection', function(socket) {
        me.socket = socket;
        socket.emit('projectId', projectId);
        socket.on('disconnect', function() {
            me.socket = undefined;
        });
    });
}

Model.prototype.save = function() {
    if (this.socket) {
        socket.emit('save');
    }
}

Model.prototype.load = function(data, callback) {
    if (this.socket) {
        this.socket.emit('load', data);
    }
}

module.exports.Model = Model;

