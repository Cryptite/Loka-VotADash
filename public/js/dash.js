$(function () {
    var showStats = $('.showstats');
    var hideStats = $('.hidestats');

    var versusSubmit = $('.submitversus');
    var blueTeam = $('.blue');
    var redTeam = $('.red');

    /* Socket Work */
    var socket = io.connect('http://loka.minecraftarium.com:3001');

    showStats.click(function (evt) {
        socket.emit("stats", {"stats": "show"});
        evt.preventDefault();
    });

    hideStats.click(function (evt) {
        evt.preventDefault();
        socket.emit("stats", {"stats": "hide"});
    });

    versusSubmit.click(function (evt) {
        evt.preventDefault();
        console.log("submitting!");
        socket.emit("versus", {"blue": blueTeam.val(), "red": redTeam.val()});
    });
});