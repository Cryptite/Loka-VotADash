var express = require('express');
var fs = require('fs'),
    request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('stats');
    collection.find({name: "game"}, function (e, docs) {
        grabAvatars(docs[0].bluetopplayers);
        grabAvatars(docs[0].redtopplayers);

        res.render('index', {data: docs});
    });
});

var grabAvatars = function (list) {
    for (var p in list) {
        if (fs.existsSync("./public/images/" + p + ".png")) continue;

        //Copy steve skin as player skin first
        fs.createReadStream('./public/images/steve.png').pipe(fs.createWriteStream('./public/images/' + p + ".png"));

        //Then download over it
        console.log("Trying to download avatar for " + p);
        download("https://minotar.net/avatar/" + p + "/49.png", "./public/images/" + p + "_dl.png", p, function (player) {
            console.log("Got avatar for " + player + ", renaming");
            fs.rename("./public/images/" + player + "_dl.png", "./public/images/" + player + ".png");
        });
    }
}

var download = function (uri, filename, player, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback(player));
    });
};

module.exports = router;
