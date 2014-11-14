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

    setInterval(function () {
        $.get('/data', function (data) {
            //Handle scores
            redScore.html(data.redscore);
            blueScore.html(data.bluescore);

            //Handle point control
            lower.attr('class', 'lower point point-' + data.point_lower);
            middle.attr('class', 'middle point point-' + data.point_middle);
            hidden.attr('class', 'hidden point point-' + data.point_hidden);

//            getStats(data)
        });
    }, 5000);

    function getStats(data) {
        var stats = $('.redstatsbody')
        stats.html('');
        for (var p in data.redtopplayers) {
            $.get('/statistics', {player: p}, function (data) {
                stats.append('<tr><th><img src="./images/' + data.name + '.png" class="statsavatar"/></th><th>' + data.name + '</th><th>' + getKDR(data) + '</th><th>' + getCPG(data) + '</th></tr>');
            });
        }
        var statsBlue = $('.bluestatsbody')
        statsBlue.html('');
        for (var p in data.bluetopplayers) {
            $.get('/statistics', {player: p}, function (data) {
                statsBlue.append('<tr><th><img src="./images/' + data.name + '.png" class="statsavatar"/></th><th>' + data.name + '</th><th>' + getKDR(data) + '</th><th>' + getCPG(data) + '</th></tr>');
            });
        }
        $('.redstats').attr('class', 'redstats show');
        $('.bluestats').attr('class', 'bluestats show');
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

        getStats(player);
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
});