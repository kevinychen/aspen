const FILE = 'pando.txt';

var fs = require('fs');
fs.writeFileSync(FILE, '', 'utf8');

/*
 * Returns data that represents the current state.
 * callback(error, data)
 */
exports.getState = function(callback) {
    fs.readFile(FILE, 'utf8', callback);
}

/*
 * Loads the state represented by data.
 * callback(error)
 */
exports.loadState = function(data, callback) {
    fs.writeFile(FILE, data, 'utf8', callback);
}

