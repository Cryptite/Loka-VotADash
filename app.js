var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// New Code
var mongo = require('mongojs');
var monk = require('monk');
var db = monk('iron.minecraftarium.com:27017/loka');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

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
app.use('/users', users);


var announceData;
app.use("/data", function (req, res) {
    var db = req.db;
    var collection = db.get('stats');

    //Get game data
    collection.find({name: "game"}, function (e, gameData) {
        res.send(gameData[0]);
    });
});
app.use("/announcement", function (req, res) {
    res.send(announceData);
});
app.use("/announce", function (req, res) {
    announceData = req.query;
    res.send("Wheee!");
});
app.use("/gotfb", function (req, res) {
    announceData = undefined;
    console.log("got fbplayer, setting to null");
    res.send("Thanks");
});
app.use("/statistics", function (req, res) {
    var playerCollection = req.db.get("players");
    var gameCollection = req.db.get("stats");
    var query = [];
    for (var redPlayer in req.query.data.redtopplayers) {
        query.push({name: redPlayer});
    }
    for (var bluePlayer in req.query.data.bluetopplayers) {
        query.push({name: bluePlayer});
    }

    playerCollection.find({$or: query}, function (e, data) {
        bluePlayers = [];
        redPlayers = [];
        var requestData = req.query.data;

        for (var i = 0; i < data.length; i++) {
            if (requestData.hasOwnProperty("bluetopplayers") && requestData.bluetopplayers.hasOwnProperty(data[i].name)) {
                bluePlayers.push(data[i]);
            } else if (requestData.hasOwnProperty("redtopplayers") && requestData.redtopplayers.hasOwnProperty(data[i].name)) {
                redPlayers.push(data[i]);
            }
        }
        res.send({red: redPlayers, blue: bluePlayers});
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