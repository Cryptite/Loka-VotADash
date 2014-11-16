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

    var bgData;

    var statState = "false";

    setInterval(function () {
        $.get('/data', function (data) {
            //Handle scores
            redScore.html(data.redscore);
            blueScore.html(data.bluescore);

            bgData = data;

            //Handle point control
            lower.attr('class', 'lower point point-' + data.point_lower);
            middle.attr('class', 'middle point point-' + data.point_middle);
            hidden.attr('class', 'hidden point point-' + data.point_hidden);

            getStats(data)
        });
    }, 5000);

    function getStats(data) {
        var stats = $('.redstatsbody')
        var statsBlue = $('.bluestatsbody')

        $.get('/statistics', {data: data}, function (data) {
            stats.html('');
            statsBlue.html('');

            for (var i = 0; i < data.red.length; i++) {
                var redPlayer = data.red[i];
                stats.append('<tr class="playerstat"><th><img src="./images/' + redPlayer.name + '.png" class="statsavatar"/></th><th>' + redPlayer.name + '</th><th>' + getScore(redPlayer.name) + '</th><th>' + getKDR(redPlayer) + '</th><th>' + getCPG(redPlayer) + '</th></tr>');
            }

            for (var i = 0; i < data.blue.length; i++) {
                var bluePlayer = data.blue[i];
                statsBlue.append('<tr class="playerstat"><th><img src="./images/' + bluePlayer.name + '.png" class="statsavatar"/></th><th>' + bluePlayer.name + '</th><th>' + getScore(bluePlayer.name) + '</th><th>' + getKDR(bluePlayer) + '</th><th>' + getCPG(bluePlayer) + '</th></tr>');
            }
        });
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

    function getScore(player) {
        return valleyCurrentScore;
    }

    function getKDR(data) {
        return (data.valleyKills / data.valleyDeaths).toFixed(2);
    }

    function getCPG(data) {
        return (data.valleyCaps / (data.valleyWins + data.valleyLosses)).toFixed(1);
    }

    function showFB(player, message) {
        announcement.attr('class', 'announce show');
        announcement_player.html(player);
        announcement_message.html(message);
        announcement_avatar.attr('src', '/images/' + player + '.png');
    }

    function hideFB() {
        setTimeout(function () {
            announcement.attr('class', 'announce hide');
        }, 5000);
    }

    setInterval(function () {
        $.get('/announcement', function (data) {
            if (data != undefined && data != "") {
                console.log("received firstblood " + data.player);
                showFB(data.player, data.message);
                $.get("/gotfb", function () {
                });
                hideFB();
            }
        })
    }, 2500);

    setInterval(function () {
        $.get('/statstate', function (data) {
            if (data != undefined && data != "") {
                if (data == statState) return;

                if (data == "true") showStats();
                else hideStats();

                statState = data;
            }
        })
    }, 2500);
});