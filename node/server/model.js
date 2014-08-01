/*
 * Database API
 */

var mysql = require('mysql2');

var db_url = 'mysql://localhost:3306/aspen?user=kchen'
var pool = mysql.createPool(db_url);

function execute(query, args, callback) {
    pool.getConnection(function(err, connection) {
        connection.query(query, args, function(err, rows, fields) {
            connection.release();
            callback(err, rows, fields);
        });
    });
}

function executeGet(query, args, callback) {
    pool.getConnection(function(err, connection) {
        connection.query(query, args, function(err, info) {
            connection.release();
            callback(err, info.insertId);
        });
    });
}

exports.execute = execute;
exports.executeGet = executeGet;

