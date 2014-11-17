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

    function updateStats(data) {
        var stats = $('.redstatsbody')
        var statsBlue = $('.bluestatsbody')

        stats.html('');
        statsBlue.html('');

        for (var red = 0; red < data['red'].length; red++) {
            var redPlayer = data.red[red];
            stats.append('<tr class="playerstat"><th><img src="./images/' + redPlayer['name'] + '.png" class="statsavatar"/></th><th>' + redPlayer['name'] + '</th><th>' + redPlayer['score'] + '</th><th>' + redPlayer['kdr'] + '</th><th>' + redPlayer['cpg'] + '</th></tr>');
        }

        for (var blue = 0; blue < data['blue'].length; blue++) {
            var bluePlayer = data.blue[blue];
            statsBlue.append('<tr class="playerstat"><th><img src="./images/' + bluePlayer['name'] + '.png" class="statsavatar"/></th><th>' + bluePlayer['name'] + '</th><th>' + bluePlayer['score'] + '</th><th>' + bluePlayer['kdr'] + '</th><th>' + bluePlayer['cpg'] + '</th></tr>');
        }
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

    //SOCKET SHIT
    var socket = io.connect('http://localhost:3001');

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