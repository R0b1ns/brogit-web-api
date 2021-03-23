function brogitClient() {

    /*$(window).scroll(function() {
        $(".brogit-reload-on-scroll").each(client_reloader);
    });*/
}

brogitClient.prototype.xhr = function(mode, route, data, callback) {

}

brogitClient.prototype.loadCallback = function() {
    $('main').append('<div class="brogit-load"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div>');
}

brogitClient.prototype.loadCallback = function() {
    $('.brogit-load').fadeOut( 1000, function() { $(this).remove(); });
}