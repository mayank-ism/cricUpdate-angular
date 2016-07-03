var express = require('express');
var request = require('request')
var config = require(__dirname + '/..' + '/config/config');

var log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: __dirname + '/../' + 'log/news.log', category: 'news' }
  ]
});

var logger = log4js.getLogger('news.js');
logger.info("In news controller");


var router = express.Router();

router.get('/', function(req, res) {
  var request_url = config.api_url + "cricketNews";
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    logger.info("Calling " + request_url);
    request(request_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        logger.info("SUCCESS: Got response from " + request_url);
        logger.debug("Response: " + body);
        res.send(body);
      } else {
        logger.error("Request failed for " + request_url);
        logger.error("Error: " + error + " Response Status: " + response.statusCode);
      }
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
