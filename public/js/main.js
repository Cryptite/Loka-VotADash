$(function () {
    var redScore = $('.redscore');
    var blueScore = $('.bluescore');

    var lower = $('.lower');
    var middle = $('.middle');
    var hidden = $('.hidden');

    var announcement = $('.announce');
    var announcement_player = $('.announceplayer');
    var announcement_message = $('.announcemessage');
    var announcement_avatar = $('.announceavatar');

    var redContainer = $('.redplayers');
    var blueContainer = $('.blueplayers');

    /* Socket Work */
    var socket = io.connect('http://localhost:3001');
    socket.emit("get_players", "-");

    /*Statistics Handling*/
    function updateStats(data) {
        var stats = $('.redstatsbody')
        var statsBlue = $('.bluestatsbody')

        stats.html('');
        statsBlue.html('');

        for (var red in data.red) {
            var redPlayer = data.red[red];
            console.log("redPlayer: " + redPlayer);
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
            "height": 25 + 'px',
            left: 20 + 'px'
        }).velocity({
            opacity: 1,
            left: 130 + "px"
        }, 1000, 'easeOutQuart', function () {
            $('.redstats').velocity({
                height: 500 + 'px'
            }, 1500, 'easeOutQuart')
        });

        $('.bluestats').css({
            "height": 25 + 'px',
            right: 20 + 'px'
        }).velocity({
            opacity: 1,
            right: 160 + "px"
        }, 1000, 'easeOutQuart', function () {
            $('.bluestats').velocity({
                height: 500 + 'px'
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

    function showFB(player, message) {
        announcement.velocity("stop");
        announcement_player.html(player);
        announcement_message.html(message);
        announcement_avatar.attr('src', '/images/' + player + '.png');
        announcement.velocity({
            opacity: [1, 0],
            scale: [1, 1.5]
        }, 500, function () {
            announcement.velocity({
                opacity: 0
            }, {
                duration: 1000,
                delay: 5000
            })
        });
    }

    //TEST populating players
    redContainer.html('');

//    setTimeout(function () {
//        populatePlayers({
//            red: {
//                0: {name: "Cryptite", score: 150, talents: [12, 24, 13]}},
////                1: {name: "Magpieman", score: 100, "talents": [1, 2, 3]}},
//            blue: {
//                0: {name: "Cryptite", score: 150, talents: [12, 24, 13]}}
////                1: {name: "Magpieman", score: 100, "talents": [1, 2, 3]}}
//        });
//    }, 1000);

    /* Populate players */
    function populatePlayers(data) {
        redContainer.html('');
        blueContainer.html('');

        var counter = 200;
        for (var red in data.red) {
            var redPlayer = data.red[red];
            addPlayer("red", redPlayer);

            counter += 400;
            $('.' + redPlayer['name']).velocity({
                opacity: 1
            }, {
                duration: 500,
                easing: 'easeOutQuart',
                delay: counter});
        }

        updateContainerPosition("red", false);

        for (var blue in data.blue) {
            var bluePlayer = data.blue[blue];
            addPlayer("blue", bluePlayer);

            counter += 400;
            $('.' + bluePlayer['name']).velocity({
                opacity: 1
            }, {
                duration: 500,
                easing: 'easeOutQuart',
                delay: counter});
        }

        updateContainerPosition("blue", false);
    }

//    setTimeout(function () {
//        addPlayer("red", {name: "adderman500", score: 150, talents: [12, 24, 13]});
//        addPlayer("red", {name: "eevee500", score: 150, talents: [12, 24, 13]});
//        addPlayer("red", {name: "eevee500", score: 150, talents: [12, 24, 13]});
////        addPlayer("red", {name: "eevee500", score: 150, talents: [12, 24, 13]});
//        updateContainerPosition("red");
//
//        addPlayer("blue", {name: "mopb3", score: 150, talents: [12, 24, 13]});
//        addPlayer("blue", {name: "Dwemer_Sphere", score: 150, talents: [12, 24, 13]});
//        addPlayer("blue", {name: "Dwemer_Sphere", score: 150, talents: [12, 24, 13]});
////        addPlayer("blue", {name: "Dwemer_Sphere", score: 150, talents: [12, 24, 13]});
//        updateContainerPosition("blue");
//    }, 6000);

    function addPlayer(team, player) {
        socket.emit("avatar", player['name']);

        if (team == "red") {
            var redHTML = '<div class="player ' + player['name'] + '"><p class="playerscore">' + player['score']
                + '</p><br/><p class="playername">' + player['name'] + '</p><br><img src="./images/steve.png" class="avatar"><br></div>';
            redContainer.append(redHTML);
        } else {
            var blueHTML = '<div class="player ' + player['name'] + '"><p class="playerscore">' + player['score']
                + '</p><br/><p class="playername">' + player['name'] + '</p><br><img src="./images/steve.png" class="avatar"><br></div>';
            blueContainer.append(blueHTML);
        }

        $('.' + player['name']).velocity({
            opacity: 1
        }, {
            duration: 500,
            easing: 'easeOutQuart',
            delay: 500});
    }

    function removePlayer(player) {
        var playerDiv = $('.' + player['name']);
//        console.log("length is " + playerDiv.length);
//        if (playerDiv.length > 1) {
//            playerDiv = playerDiv[0];
//        }
//        var parentDiv = playerDiv.parentNode;
        playerDiv.velocity({
            opacity: 0
        }, {
            duration: 500,
            easing: 'easeOutQuart',
            complete: function (e) {
                if (player['team'] == "red") {
                    redContainer.removeChild(playerDiv);
                } else {
                    blueContainer.removeChild(playerDiv);
                }
            }});
    }

    function updateContainerPosition(team, animated) {
        if (team == "red") {
            var count = redContainer[0].childNodes.length;
            redContainer.css('left', getTeamPos(count));
        } else {
            var blueCount = redContainer[0].childNodes.length;
            blueContainer.css('right', getTeamPos(blueCount));
        }
    }

    function getTeamPos(numPlayers) {
        if (numPlayers <= 1) return 40 + '%';
        else if (numPlayers > 5) return 20 + '%';
        else {
            return 40 - (numPlayers * 6) + '%';
        }
    }

    function updatePlayerScore(data) {
        var player = $('.' + data['name']);
        player.find('.playerscore').html(data['score']);
    }

    setTimeout(function () {
        showFB('Cryptite', 'First Blood!');
    }, 2000);

    setTimeout(function () {
        showFB('Cryptite', 'Double Kill!');
    }, 4000);

    setTimeout(function () {
        showFB('13lackpearl', 'Penta Kill!');
    }, 6000);

    setTimeout(function () {
        showFB('Magpieman', 'Double Kill!');
    }, 15000);

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