var http = require('http');
var url = require('url');
var model = require('./model');

function onRequest(req, res) {
    var pathname = url.parse(req.url).pathname;
    if (req.method === 'GET' && pathname === '/save') {
        model.getState(function(err, data) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.write(data);
            res.end();
        });
    } else if (req.method === 'POST' && pathname === '/load') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            model.loadState(body, function(err) {
                res.end();
            });
        });
    } else {
        res.end();
    }
}

http.createServer(onRequest).listen(process.argv[2]);

