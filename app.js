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
//    if (req.method == "GET" && req.originalUrl.indexOf("/images") > -1) {
//        //This is fucking insane. Intercept all image get requests and auto-grab the avatar if we need to. Holy Shit!
//        var player = req.originalUrl.split("/")[2].split(".")[0];
//
//        var avatarPath = "./public/images/" + player + ".png";
//        var stevePath = "./public/images/steve.png";
//
//        if (fs.existsSync(avatarPath)
//            && fs.statSync(avatarPath)["size"] > 0
//            && fs.statSync(avatarPath)["size"] != fs.statSync(stevePath)["size"]) {
//
//            console.log(player + " found, skipping");
//            req.db = db;
//            next();
//            return;
//        }
//
//        //Copy steve skin as player skin first
//        fs.createReadStream(stevePath).pipe(fs.createWriteStream(avatarPath));
//
//        //Then download over it
//        console.log("Trying to download avatar for " + player);
//        request.head("https://minotar.net/avatar/" + player + "/49.png", function (err, requestResponse, body) {
//            console.log('content-type:', requestResponse.headers['content-type']);
//            console.log('content-length:', requestResponse.headers['content-length']);
//
//            request("https://minotar.net/avatar/" + player + "/49.png").pipe(fs.createWriteStream("./public/images/" + player + "_dl.png")).on('close', function () {
//                if (fs.existsSync("./public/images/" + player + "_dl.png")) {
//                    console.log("Renaming " + player);
//                    fs.rename("./public/images/" + player + "_dl.png", "./public/images/" + player + ".png");
//                    req.db = db;
//                    next();
//                }
//            });
//        });
//    } else {
    req.db = db;
    next();
//    }
});

app.use('/', routes);
app.use('/dash', dash);
app.use('/intro', intro);
app.use('/users', users);

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