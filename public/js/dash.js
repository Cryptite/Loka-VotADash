$(function () {
    var showStats = $('.showstats');
    var hideStats = $('.hidestats');
    var state = $('.statstate');

    showStats.click(function (evt) {
        evt.preventDefault();

        $.ajax({
            url: "/showstats/",
            success: function (e) {
                state.html("Showing");
            }
        });
    });

    hideStats.click(function (evt) {
        evt.preventDefault();

        $.ajax({
            url: "/hidestats/",
            type: "GET",
            success: function (e) {
                state.html("Hidden");
            }
        });
    });
});