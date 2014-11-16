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

            var redHeight = $('.redstats').height();
            $('.redstats').css({
                "height": 30 + 'px'
            }).velocity({
                opacity: 1,
                left: 190 + "px"
            }, 1000, 'easeOutQuart', function () {
                $('.redstats').velocity({
                    height: redHeight
                }, 1500, 'easeOutQuart')
            });

            var blueHeight = $('.bluestats').height();
            $('.bluestats').css({
                "height": 30 + 'px'
            }).velocity({
                opacity: 1,
                right: 200 + "px"
            }, 1000, 'easeOutQuart', function () {
                $('.bluestats').velocity({
                    height: blueHeight
                }, 1500, 'easeOutQuart')
            });
        });
    }

    function getScore(player) {
        console.log("getting data for " + player)
        for (var i = 0; i < bgData.bluetopplayers.length; i++) {
            console.log(bgData.bluetopplayers.player);
        }
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
})
;