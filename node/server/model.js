/*
 * Database API
 */

var mysql = require('mysql2');

var db_url = 'mysql://localhost:3306/pando?user=kchen'
var pool = mysql.createPool(db_url);

function execute(query, args, callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            callback(err);
        } else {
            connection.query(query, args, function(err, rows, fields) {
                connection.release();
                callback(err, rows, fields);
            });
        }
    });
}
exports.execute = execute;

