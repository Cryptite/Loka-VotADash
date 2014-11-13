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
        });
    }, 5000);

    function showFB(player, message) {
        announcement.attr('class', 'announce show');
        announcement_player.html(player);
        announcement_message.html(message);
        announcement_avatar.attr('src', '/images/' + player + '.png');
    }

    function hideFB() {
        setTimeout(function () {
            announcement.attr('class', 'announce hide');
        }, 3500);
    }

    setInterval(function () {
        $.get('/firstblood', function (data) {
            if (data != undefined && data != "") {
                console.log("received firstblood " + data);
                showFB(data, "First Blood BITCH!");
                $('.firstblood').html(data);
                $.get("/gotfb", function () {
                });
                hideFB();
            }
        })
    }, 2000);
});