var fs = require('fs');

function Model(master, args) {
    this.master = master;
    this.file = args[0];
    this.current = '';
    var me = this;
    fs.watchFile(this.file, function() {
        fs.readFile(me.file, 'utf8', function(err, data) {
            if (data !== me.current) {
                me.master.save(data);
            }
        });
    });
}

Model.prototype.save = function() {
    var me = this;
    fs.readFile(this.file, 'utf8', function(err, data) {
        me.master.save(data);
    });
}

Model.prototype.load = function(data, callback) {
    this.current = data;
    fs.writeFile(this.file, data, 'utf8', callback);
}

module.exports.Model = Model;

