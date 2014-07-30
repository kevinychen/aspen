var express = require('express');
var http = require('http');
var routes = require('./server/routes');

var app = express();

app.set('port', '8080');
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

app.use(express.cookieParser());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.session({ secret: 'PANDO' }));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.home);
app.get('/main/:projectId', routes.main);
app.get('/states/:projectId', routes.getStateObjs);
app.get('/state/:stateId', routes.getState);
app.post('/requestSave', routes.requestSave);
app.post('/save', routes.save);
app.post('/load', routes.load);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

