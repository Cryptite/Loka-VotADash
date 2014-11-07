var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('stats');
    collection.find({name: "game"}, function (e, docs) {
        res.render('index', {data: docs});
    });
});

module.exports = router;
