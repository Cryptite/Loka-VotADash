$(function () {
    var redScore = $('.red');
    var blueScore = $('.blue');

    var redTeamScoreName = $('.rednamescore');
    var redTeamStatsName = $('.redname');
    var blueTeamScoreName = $('.bluenamescore');
    var blueTeamStatsName = $('.bluename');

    var lower = $('.lower');
    var middle = $('.middle');
    var hidden = $('.hidden');

    var announcement = $('.announce');
    var announcement_player = $('.announceplayer');
    var announcement_message = $('.announcemessage');
    var announcement_avatar = $('.announceavatar');

    var redContainer = $('.redplayers');
    var blueContainer = $('.blueplayers');

    var redTeamName = "Red Team";
    var blueTeamName = "Blue Team";

    var killCounter = 0;

    /* Socket Work */
    var socket = io.connect('http://lokamc.com:3001');
    socket.emit("get_players", "-");

    /*Statistics Handling*/
    function updateStats(data) {
        var stats = $('.redstatsbody');
        var statsBlue = $('.bluestatsbody');

        stats.html('');
        statsBlue.html('');

        for (var red in data.red) {
            var redPlayer = data.red[red];
            console.log(redPlayer);
            stats.append('<tr class="playerstat"><th><img src="./images/' + redPlayer['name']
                + '.png" class="statsavatar"/></th><th>' + redPlayer['name'] + '</th><th>' + redPlayer['score']
                + '</th><th>' + redPlayer['kills'] + '</th><th>' + redPlayer['deaths'] + '</th><th>'
                + redPlayer['caps'] + '</th></tr>');
        }

        for (var blue in data.blue) {
            console.log(bluePlayer);
            var bluePlayer = data.blue[blue];
            statsBlue.append('<tr class="playerstat"><th><img src="./images/' + bluePlayer['name']
                + '.png" class="statsavatar"/></th><th>' + bluePlayer['name'] + '</th><th>' + bluePlayer['score']
                + '</th><th>' + bluePlayer['kills'] + '</th><th>' + bluePlayer['deaths'] + '</th><th>'
                + bluePlayer['caps'] + '</th></tr>');
        }
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
//        updateStats({
//            red: {
//                0: {name: "Leasaur", score: 150, kdr: 1.5, cpg: 5.2},
//                1: {name: "godemox", score: 150, kdr: 1.5, cpg: 5.2},
//                2: {name: "computern", score: 150, kdr: 1.5, cpg: 5.2}},
//            blue: {
//                0: {name: "Defgnww", score: 150, kdr: 1.7, cpg: 6.2},
//                1: {name: "mopb3", score: 150, kdr: 1.5, cpg: 5.2},
//                2: {name: "MasterTargaryen", score: 150, kdr: 1.5, cpg: 5.2}}
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

//        updateContainerPosition("red");

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

//        updateContainerPosition("blue");
    }

//    setTimeout(function () {
//        addPlayer("red", {name: "Defgnww", score: 150, talents: [27, 36, 28]});
//        addPlayer("red", {name: "MasterTargaryen", score: 150, talents: [37, 30, 39]});
//        addPlayer("red", {name: "mopb3", score: 150, talents: [34, 43, 35]});
////        updateContainerPosition("red");
//
//        addPlayer("blue", {name: "godemox", score: 150, talents: [39, 27, 35]});
//        addPlayer("blue", {name: "computern", score: 150, talents: [34, 39, 30]});
//        addPlayer("blue", {name: "Leasaur", score: 150, talents: [44, 39, 43]});
////        updateContainerPosition("blue");
//    }, 3000);

    function addPlayer(team, player) {
        socket.emit("avatar", player['name']);

        if (team == "red") {
            var redHTML = '<div class="player ' + player['name'] + '"><p class="playerscore">' + player['score']
                + '</p><br/><p class="playername">' + player['name'] + '</p><br><img src="./images/steve.png" class="avatar"><div class="talentscontainer">';
            var redTalents = player['talents'].split(",");
            for (var t = 0; t < redTalents.length; t++) {
                redHTML += getTalent(redTalents[t]);
            }
            redHTML += '</div></div>';
            redContainer.append(redHTML);
        } else {
            var blueHTML = '<div class="player ' + player['name'] + '"><p class="playerscore">' + player['score']
                + '</p><br/><p class="playername">' + player['name'] + '</p><br><div class="talentscontainer">';

            var blueTalents = player['talents'].split(",");
            for (var blueTalent = 0; blueTalent < blueTalents.length; blueTalent++) {
                blueHTML += getTalent(blueTalents[blueTalent]);
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

    function getTalent(number) {
        if (number == "27") {
            return '<img src="./images/frosttrap.png" class="talent offense"/>';
        } else if (number == "36") {
            return '<img src="./images/explosivearrow.png" class="talent offense"/>';
        } else if (number == "28") {
            return '<img src="./images/thrillofthekill.png" class="talent offense"/>';
        } else if (number == "37") {
            return '<img src="./images/lunge.png" class="talent offense"/>';
        } else if (number == "30") {
            return '<img src="./images/hook.png" class="talent defense"/>';
        } else if (number == "39") {
            return '<img src="./images/quake.png" class="talent defense"/>';
        } else if (number == "41") {
            return '<img src="./images/laststand.png" class="talent defense"/>';
        } else if (number == "34") {
            return '<img src="./images/rallyingcry.png" class="talent support"/>';
        } else if (number == "43") {
            return '<img src="./images/silence.png" class="talent support"/>';
        } else if (number == "35") {
            return '<img src="./images/lifeshield.png" class="talent support"/>';
        } else if (number == "44") {
            return '<img src="./images/freyjiasarrow.png" class="talent support"/>';
        } else {
            return ""
        }
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
            complete: function () {
                if (player['team'] == "red") {
                    redContainer.removeChild(playerDiv);
                } else {
                    blueContainer.removeChild(playerDiv);
                }
            }});
    }

    function updateContainerPosition(team) {
        if (team == "red") {
            var count = redContainer[0].childNodes.length;
            redContainer.css('left', getTeamPos(count));
        } else {
            var blueCount = redContainer[0].childNodes.length;
            blueContainer.css('right', getTeamPos(blueCount));
        }
    }

    function showKill(data) {
        var kills = $('.kills');
        var killHTML = '<div class="kill kill-' + data.team + ' kill-' + killCounter + '"><img src="./images/' + data.killer
            + '.png" class="killer"><img src="./images/' + data.victim + '.png" class="victim"></div>';
        kills.append(killHTML);

        var thisKill = $('.kill-' + killCounter);

        //Show kill popup
        thisKill.velocity({
            opacity: [1, 0],
            scale: [1, 1.5]
        }, 500, function () {
            thisKill.velocity({
                opacity: 0
            }, {
                duration: 1000,
                delay: 5000,
                complete: function () {
                    thisKill.remove();
                }
            })
        });

        //'Gray' out the player on the bottom player
        var player = $('.' + data.victim).find(".avatar");
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

        killCounter++;
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

    socket.on('announce', function (data) {
        showFB(data['player'], data['message']);
    });

    socket.on('stats', function (data) {
        console.log("stats: " + data);
        if (data.stats == "show") {
            updateStats(data);
            showStats();
        } else {
            hideStats();
        }
    });

    socket.on('playerscore', function (data) {
        updatePlayerScore(data);
    });

    socket.on('kill', function (data) {
        showKill(data);
    });

    socket.on('joinplayer', function (data) {
        addPlayer(data['team'], data);
    });

    socket.on('leaveplayer', function (data) {
        removePlayer(data);
    });

    socket.on('teams', function (data) {
        redTeamName = data["red"];
        blueTeamName = data["blue"];

        redTeamScoreName.html(redTeamName);
        redTeamStatsName.html(redTeamName);
        blueTeamScoreName.html(blueTeamName);
        blueTeamStatsName.html(blueTeamName);
    });

    socket.on('scores', function (data) {
        redScore.html(data["red"]);
        blueScore.html(data["blue"]);
    });

    socket.on('players', function (data) {
        populatePlayers(data);
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

    socket.on('update_avatar', function (data) {
        console.log("Updating avatar for " + data.name);
        var player = $('.' + data.name);
        player.find(".avatar").attr('src', data.path);
    });
});