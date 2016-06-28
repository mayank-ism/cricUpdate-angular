var express = require('express');

var app = express();
var config = require('./config/config');
var log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: __dirname + '/log/app.log', category: 'app' }
  ]
});

var logger = log4js.getLogger('app.js');

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/view/index.html');
});

app.use(require('./controller'));

app.listen(config.port);
logger.info("Listening to port: " + config.port);
