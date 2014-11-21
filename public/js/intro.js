$(function () {
    var redScore = $('.redstats');
    var blueScore = $('.bluestats');

    /* Socket Work */
    var socket = io.connect('http://localhost:3001');
    socket.emit("get_players", "-");

    /*Statistics Handling*/
    function updateStats(data) {
        var stats = $('.redstatsbody');
        var statsBlue = $('.bluestatsbody');

        stats.html('');
        statsBlue.html('');

        for (var red in data.red) {
            var redPlayer = data.red[red];
            stats.append('<tr class="playerstat"><th><img src="./images/' + redPlayer['name'] + '.png" class="statsavatar"/></th><th>' + redPlayer['name'] + '</th><th>' + redPlayer['score'] + '</th><th>' + redPlayer['kdr'] + '</th><th>' + redPlayer['cpg'] + '</th></tr>');
        }

        for (var blue in data.blue) {
            var bluePlayer = data.blue[blue];
            statsBlue.append('<tr class="playerstat"><th><img src="./images/' + bluePlayer['name'] + '.png" class="statsavatar"/></th><th>' + bluePlayer['name'] + '</th><th>' + bluePlayer['score'] + '</th><th>' + bluePlayer['kdr'] + '</th><th>' + bluePlayer['cpg'] + '</th></tr>');
        }

        showStats();
    }

    function showStats() {
        $('.redstats').css({
            "height": 35 + 'px',
            left: 20 + 'px'
        }).velocity({
            opacity: 1,
            left: 130 + "px"
        }, 1000, 'easeOutQuart', function () {
            $('.redstats').velocity({
                height: 200 + 'px'
            }, 1500, 'easeOutQuart')
        });

        $('.bluestats').css({
            "height": 35 + 'px',
            right: 20 + 'px'
        }).velocity({
            opacity: 1,
            right: 160 + "px"
        }, 1000, 'easeOutQuart', function () {
            $('.bluestats').velocity({
                height: 200 + 'px'
            }, 1500, 'easeOutQuart')
        });
    }

    function hideStats() {
        $('.redstats').velocity({
            opacity: 0
        }, 1000, 'easeOutQuart');

        $('.bluestats').velocity({
            opacity: 0
        }, 1000, 'easeOutQuart');
    }

    setTimeout(function () {
        addPlayer("red", {name: "Defgnww", score: 150, talents: [12, 24, 13]});
        addPlayer("red", {name: "MasterTargaryen", score: 150, talents: [12, 24, 13]});
        addPlayer("red", {name: "mopb3", score: 150, talents: [12, 24, 13]});
//        addPlayer("red", {name: "eevee500", score: 150, talents: [12, 24, 13]});
        updateContainerPosition("red");

        addPlayer("blue", {name: "godemox", score: 150, talents: [12, 24, 13]});
        addPlayer("blue", {name: "computern", score: 150, talents: [12, 24, 13]});
        addPlayer("blue", {name: "Leasaur", score: 150, talents: [12, 24, 13]});
//        addPlayer("blue", {name: "Dwemer_Sphere", score: 150, talents: [12, 24, 13]});
        updateContainerPosition("blue");
    }, 6000);

    socket.on('announce', function (data) {
        showFB(data['player'], data['message']);
    });

    socket.on('playerscore', function (data) {
        updatePlayerScore(data);
    });

    socket.on('joinplayer', function (data) {
        addPlayer(data['team'], data);
    });

    socket.on('leaveplayer', function (data) {
        removePlayer(data);
    });

    socket.on('scores', function (data) {
        redScore.html(data["red"]);
        blueScore.html(data["blue"]);
    });

    socket.on('players', function (data) {
        populatePlayers(data);
    });

    socket.on('artifact', function (data) {
        if (data["artifact"] == "lower") {
            lower.attr('class', 'lower point point-' + data["team"]);
        } else if (data["artifact"] == "middle") {
            middle.attr('class', 'middle point point-' + data["team"]);
        } else if (data["artifact"] == "hidden") {
            hidden.attr('class', 'hidden point point-' + data["team"]);
        }
    });

    socket.on('update_avatar', function (data) {
        console.log("Updating avatar for " + data.name);
        var player = $('.' + data.name);
        player.find(".avatar").attr('src', data.path);
    });

    socket.on('killed', function (data) {
        var player = $('.' + data['name']).find(".avatar");
        player.velocity({
            opacity: .25
        }, 500, function () {
            player.velocity({
                opacity: 1
            }, {
                duration: 1000,
                delay: 10000
            });
        });
    });
});