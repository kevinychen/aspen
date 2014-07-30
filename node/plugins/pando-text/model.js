var fs = require('fs');

function Model(master, args) {
    this.master = master;
    this.file = args[0];
    var me = this;
    fs.watchFile(this.file, function() {
        me.save();
    });
}

Model.prototype.save = function() {
    var me = this;
    fs.readFile(this.file, 'utf8', function(err, data) {
        me.master.save(data);
    });
}

Model.prototype.load = function(data, callback) {
    fs.writeFile(this.file, data, 'utf8', callback);
}

module.exports.Model = Model;

