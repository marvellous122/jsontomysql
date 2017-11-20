var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var models  = require('./models');


var app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var fs = require('fs');

var path = require('path');

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.stat(dirname + filename, function(err, stat) {
        if (stat && stat.isDirectory()) {
          readFiles(dirname + filename + '/', onFileContent, onError);
        } else {
          if (path.extname(filename) === '.json') {
            fs.readFile(dirname + filename, 'utf-8', function(err, content) {
              if (err) {
                return;
              }
              onFileContent(filename, content);
            });
          }
        }
      });
    });
  });
}


var data = {};
readFiles('sessions/', function(filename, content) {
  
  var events = JSON.parse(content).events;
  var starttime = JSON.parse(content).start_timestamp;
  var endtime = JSON.parse(content).end_timestamp;

  starttime = new Date(starttime);
  endtime = new Date(endtime);
  
  var length = 0;
  var list = [];

  var i = 0;
  (function next() {
    var event = events[i++];
    if (!event) return;
    if (event.type === 1) {
      length ++;
      list.push(event.view_controller);
    }
    if (i >= events.length) {
      models.sessions.create({
        length: length,
        controller: list.toString(),
        fromDate: starttime,
        toDate: endtime
      })
      return;
    }
    next();
  })();
}, function(err) {
  console.log( err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});


module.exports = app;
