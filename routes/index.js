var express = require('express');
var fs = require('fs'),
    request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

module.exports = router;
