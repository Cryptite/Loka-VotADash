$(function () {
    var statsButton = $('.stats');

    var versusSubmit = $('.submitversus');
    var blueTeam = $('.blue');
    var redTeam = $('.red');

    /* Socket Work */
    var socket = io.connect('http://loka.minecraftarium.com:3001');

    statsButton.click(function (evt) {
        if (statsButton.html() == "Show") {
            socket.emit("stats", {"stats": "show"});
            statsButton.html("Hide");
        } else {
            socket.emit("stats", {"stats": "hide"});
            statsButton.html("Show");
        }
        evt.preventDefault();
    });

    versusSubmit.click(function (evt) {
        evt.preventDefault();
        socket.emit("versus", {"blue": blueTeam.val(), "red": redTeam.val()});
    });

    setTimeout(function () {
        setCurrentMatch({red: "Blobs", blue: "Pops"});
    }, 2000);

    function setCurrentMatch(data) {
        blueTeam.val(data.blue);
        redTeam.val(data.red);
    }

    socket.on('currentMatch', function (data) {
        setCurrentMatch(data);
    });
});