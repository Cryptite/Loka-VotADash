$(function () {
    var redStats = $('.redstatsintro');
    var blueStats = $('.bluestatsintro');

    var versusRed = $('.redTeam');
    var versusBlue = $('.blueTeam');

    /* Socket Work */
    var socket = io.connect('http://loka.minecraftarium.com:3001');
    socket.emit("get_current_match", "-");

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
    }

    function showStats() {
        redStats.css({
            "height": 35 + 'px',
            left: 20 + 'px'
        }).velocity({
            opacity: 1,
            left: 130 + "px"
        }, 1000, 'easeOutQuart', function () {
            redStats.velocity({
                height: 200 + 'px'
            }, 1500, 'easeOutQuart')
        });

        blueStats.css({
            "height": 35 + 'px',
            right: 20 + 'px'
        }).velocity({
            opacity: 1,
            right: 160 + "px"
        }, 1000, 'easeOutQuart', function () {
            blueStats.velocity({
                height: 200 + 'px'
            }, 1500, 'easeOutQuart')
        });
    }

    function hideStats() {
        redStats.velocity({
            opacity: 0
        }, 1000, 'easeOutQuart');

        blueStats.velocity({
            opacity: 0
        }, 1000, 'easeOutQuart');
    }

//    setTimeout(function () {
//        updateStats({
//            red: {
//                0: {name: "Leasaur", score: 410, kdr: 1.5, cpg: 5.2},
//                1: {name: "godemox", score: 150, kdr: 1.5, cpg: 5.2},
//                2: {name: "computern", score: 150, kdr: 1.5, cpg: 5.2}},
//            blue: {
//                0: {name: "Defgnww", score: 150, kdr: 1.7, cpg: 6.2},
//                1: {name: "mopb3", score: 150, kdr: 1.5, cpg: 5.2},
//                2: {name: "MasterTargaryen", score: 150, kdr: 1.5, cpg: 5.2}}
//        });
//        showStats();
//    }, 1000);

    function addPlayer(team, player) {
        socket.emit("avatar", player['name']);

        if (team == "red") {
            var redHTML = '<div class="player ' + player['name'] + '"><p class="playerscore">' + player['score']
                + '</p><br/><p class="playername">' + player['name'] + '</p><br><img src="./images/steve.png" class="avatar"><div class="talentscontainer">';
            for (var t = 0; t < player['talents'].length; t++) {
                redHTML += getTalent(player['talents'][t]);
            }
            redHTML += '</div></div>';
            redContainer.append(redHTML);
        } else {
            var blueHTML = '<div class="player ' + player['name'] + '"><p class="playerscore">' + player['score']
                + '</p><br/><p class="playername">' + player['name'] + '</p><br><div class="talentscontainer">';

            for (var blueTalent = 0; blueTalent < player['talents'].length; blueTalent++) {
                blueHTML += getTalent(player['talents'][blueTalent]);
            }
            blueHTML += '</div><img src="./images/steve.png" class="avatar"/></div>';
            blueContainer.append(blueHTML);
        }

        $('.' + player['name']).velocity({
            opacity: 1
        }, {
            duration: 500,
            easing: 'easeOutQuart',
            delay: 500});
    }

    socket.on('stats', function (data) {
        if (data.stats == "show") {
            updateStats(data);
            showStats();
        } else {
            hideStats();
        }
    });

    socket.on('versus', function (data) {
        versusRed.html(data["red"]);
        versusBlue.html(data["blue"]);

        versusRed.velocity({
            opacity: [1, 0],
            scale: [1, 1.5]
        }, {
            duration: 1000,
            delay: 1000
        });
        versusBlue.velocity({
            opacity: [1, 0],
            scale: [1, 1.5]
        }, {
            duration: 1000,
            delay: 1000
        });
    });
});