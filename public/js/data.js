var mongojs = require('mongojs');

var uri = "mongodb://iron.minecraftarium.com:27017/loka";
var db = mongojs.connect(uri, ["stats"]);
fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err;
    }

    db.stats.find({name: 'vota'}, function (err, data) {
        if (err) {
            console.log("No database connection");
            res.end();
            return;
        }

        var html2 = "games: " + data[0].games;
    });
});