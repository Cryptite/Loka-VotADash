$(function () {
    var redScore = $('.red');
    var blueScore = $('.blue');

    var lower = $('.lower');
    var middle = $('.middle');
    var hidden = $('.hidden');

    var announcement = $('.announce');
    var announcement_player = $('.announceplayer');
    var announcement_message = $('.announcemessage');
    var announcement_avatar = $('.announceavatar');

    var redContainer = $('.redplayers');
    var blueContainer = $('.blueplayers');

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
        announcement.attr('class', 'announce hide');
        announcement.attr('class', 'announce show');
        announcement_player.html(player);
        announcement_message.html(message);
        announcement_avatar.attr('src', '/images/' + player + '.png');
        hideFB();
    }

    function hideFB() {
        setTimeout(function () {
            announcement.attr('class', 'announce hide');
        }, 5000);
    }

    //TEST populating players
    redContainer.html('');

    setTimeout(function () {
        populatePlayers({
            red: {
                0: {name: "Cryptite", score: 150, talents: [12, 24, 13]}},
//                1: {name: "Magpieman", score: 100, "talents": [1, 2, 3]}},
            blue: {
                0: {name: "Cryptite", score: 150, talents: [12, 24, 13]}}
//                1: {name: "Magpieman", score: 100, "talents": [1, 2, 3]}}
        });
    }, 1000);

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

    //test player join
//    setTimeout(function () {
//        addPlayer("red", {name: "Cryptite", score: 150, talents: [12, 24, 13]});
//        addPlayer("red", {name: "eevee500", score: 150, talents: [12, 24, 13]});
//        updateContainerPosition("red");
//
//        addPlayer("blue", {name: "13lackpearl", score: 150, talents: [12, 24, 13]});
//        addPlayer("blue", {name: "erodster", score: 150, talents: [12, 24, 13]});
//        updateContainerPosition("blue");
//    }, 6000);

    function addPlayer(team, player) {
        if (team == "red") {
            var redHTML = '<div class="player ' + player['name'] + '"><p class="playername">'
                + player['name'] + '</p><br><img src="./images/' + player['name']
                + '.png" class="avatar"><br><p class="playerscore">' + player['score'] + '</p></div>';
            redContainer.append(redHTML);
        } else {

            var blueHTML = '<div class="player ' + player['name'] + '"><p class="playername">'
                + player['name'] + '</p><br><img src="./images/' + player['name']
                + '.png" class="avatar"><br><p class="playerscore">' + player['score'] + '</p></div>';
            blueContainer.append(blueHTML);
        }

        $('.' + player['name']).velocity({
            opacity: 1
        }, {
            duration: 500,
            easing: 'easeOutQuart',
            delay: 500});
    }

    function updateContainerPosition(team, animated) {
        if (team == "red") {
            var count = redContainer[0].childNodes.length;

            var newPos = 10 + (5 * count) + "%";
            redContainer.css('left', newPos);

//            if (animated) {
//                redContainer.velocity({
//                    left: newPos
//                }, 500);
//            } else {
//                redContainer.css('left', newPos);
//            }
        } else {
            var blueCount = redContainer[0].childNodes.length;

            blueContainer.velocity({
                right: 10 + (5 * blueCount) + '%'
            }, 500);
        }
    }


    //TEST updating player score
    setTimeout(function () {
        updatePlayerScore({name: "Cryptite", score: 200, "talents": [12, 24, 13]});
    }, 4000);

    function updatePlayerScore(data) {
        var player = $('.' + data['name']);
        player.find('.playerscore').html(data['score']);
    }

    /* Socket Work */
    var socket = io.connect('http://loka.minecraftarium.com:3001');

    socket.on('announce', function (data) {
        showFB(data['player'], data['message']);
    });

    socket.on('scores', function (data) {
        redScore.html(data["red"]);
        blueScore.html(data["blue"]);
    });

    socket.on('stats', function (data) {
        updateStats(data);
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
});