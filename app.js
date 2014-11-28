var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// New Code
var mongo = require('mongojs');
var monk = require('monk');
var fs = require('fs'),
    request = require('request');
var db = monk('iron.minecraftarium.com:27017/loka');

var routes = require('./routes/index');
var dash = require('./routes/dash');
var intro = require('./routes/intro');
var users = require('./routes/users');

var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/dash', dash);
app.use('/intro', intro);
app.use('/users', users);

app.use("/territories", function (req, res) {
    var db = req.db;
    var collection = db.get('territories');

    //Get game data
    collection.find({}, function (e, data) {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        //Make this data more meaningful
        var mapData = {};
        var towns = [];
        for (var i = 0; i <= data.length; i++) {
            var node = data[i];
            if (node != undefined) {
                if (towns.indexOf(node.town) == -1) {
                    towns.push(node.town);
                }
            }
        }

        for (var t = 0; t <= towns.length; t++) {
            var townData = [];
            var townName = towns[t];
            for (var i = 0; i <= data.length; i++) {
                var node = data[i];
                if (node != undefined && node.town == townName) {
                    townData.push(node);
                }
            }
            mapData[townName] = townData;
        }

        res.send(mapData);
    });
});

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;