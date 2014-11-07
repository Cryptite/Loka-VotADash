var http = require('http');
var mongojs = require('mongojs');

var uri = "mongodb://iron.minecraftarium.com:27017/loka";
var db = mongojs.connect(uri, ["stats"]);

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    db.stats.find({name: 'vota'}, function (err, data) {
        if (err) {
            console.log("No database connection");
            res.end();
            return;
        }

        var html = "games: " + data[0].games;
        console.log(data);
        res.write(html);
        res.end();
    })
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');