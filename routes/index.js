var express = require('express');
var fs = require('fs'),
    request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('stats');

    //Get game data
    collection.find({name: "game"}, function (e, gameData) {
        grabAvatars(gameData[0].bluetopplayers);
        grabAvatars(gameData[0].redtopplayers);

        res.render('index', {data: gameData});
    });
});

var grabAvatars = function (list) {
    var stevePath = "../public/images/steve.png";

    for (var player in list) {
        var avatarPath = "../public/images/" + player + ".png";
        if (fs.existsSync(avatarPath)
            && fs.statSync(avatarPath)["size"] > 0
            && fs.statSync(avatarPath)["size"] != fs.statSync(stevePath)["size"]) continue;

        //Copy steve skin as player skin first
        fs.createReadStream(stevePath).pipe(fs.createWriteStream(avatarPath));

        //Then download over it
        console.log("Trying to download avatar for " + player);
        download(player);
    }
};

var download = function (player) {
    request.head("https://minotar.net/avatar/" + player + "/49.png", function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request("https://minotar.net/avatar/" + player + "/49.png").pipe(fs.createWriteStream("../public/images/" + player + "_dl.png")).on('close', function () {
            if (fs.existsSync("../public/images/" + player + "_dl.png")) {
                console.log("Renaming " + player);
                fs.rename("../public/images/" + player + "_dl.png", "../public/images/" + player + ".png");
            }
        });
    });
};

module.exports = router;
