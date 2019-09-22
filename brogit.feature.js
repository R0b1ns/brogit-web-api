/*!
  * brogit feature v1.19.9 (https://brogit.de/)
  * 2017-2019 Copyright (c) brogit
  * Requirements: jQuery 3, Bootstrap 4, (optional) Moment.js, (optional) toastr
  */

var showImgModal = function(title, imgurl, description) {
	if(!$('.bs-img-modal-lg').length) {
		$('body').append('<div class="modal fade bs-img-modal-lg" tabindex="-1" role="dialog" aria-labelledby="ImgModalFullscreen"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="ImgModalFullscreen"></h4><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button></div><div class="modal-body"><img class="img-fluid d-block mx-auto" src=""></div><div class="modal-footer"><div class="modal-description"></div><button type="button" class="btn btn-primary" data-dismiss="modal">Schließen</button></div></div></div></div>');
	}

	$('.bs-img-modal-lg .modal-title').html(title);
	$('.bs-img-modal-lg .modal-body img').attr('src', imgurl);
	$('.bs-img-modal-lg .modal-description').html(description);

	$('.bs-img-modal-lg').modal('show');
};

/**
 * Generic jQuery extensions
 */
$.fn.extend({
	imgFullscreen: function(name, url, description) {
		$(this).addClass('img-fullscreen');

		var name = name || $(this).attr('data-name');
		var url = url || $(this).attr('data-url');
		var description = description || $(this).attr('data-description');

		$(this).attr('data-name', name);
		$(this).attr('data-url', url);
		$(this).attr('data-description', description);

		if($._data( this, "events" ) == null) {
			$(this).on("click", {name:name, url:url, description:description}, function( event ) {
				showImgModal(name, event.data.url, event.data.description);
			});
		}

		return this;
	},
	fromNow: function(datetime) {
		$(this).addClass('moment-fromnow');

		var datetime = datetime || $(this).attr('data-datetime');

		$(this).attr('data-datetime', datetime);

		$(this).text(moment(datetime, "YYYY-MM-DD hh:mm:ss").fromNow());

		return this;
	},
	window_load: function() {
		$(this).addClass('window-load');
		$(this).html('<div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>');
	}
});

function initBrogitFeatures() {
	$('.window-load').window_load();

	//construct
	var anim_zoom = function() {
		var pos = $(this).offset().top;
		var winTop = $(window).scrollTop();

		var height = $(this).height();
		var screenY = $(window).innerHeight();

		if( ( (pos + height) > winTop ) && (pos < (winTop + screenY)) )
		{
			var zoom = 1 + (0.2 * (1 - ( (pos + height - winTop) / (screenY + height) )));
		$(this).css('transform', 'scale('+zoom+')');
		}
	};

	var anim_slide = function(){
		var pos = $(this).offset().top;

		var winTop = $(window).scrollTop();
		
		if (pos < winTop + 600) {
			$(this).addClass("slide-up");
		}
	};

	if((lang = $('html').attr('lang')) && (typeof moment != 'undefined')) {
		moment.locale(lang);
	}

	//init
	$(".anim-zoom").each(anim_zoom);
	$(".moment-fromnow").each(function(){
		$(this).fromNow();
	});

	//eventhandling
	$(window).scroll(function() {
		$(".anim-zoom").each(anim_zoom);
	    $(".anim-slide").each(anim_slide);
	});

	// Initiator Generic imgFullscreen
	$( ".img-fullscreen" ).each(function() {
		$(this).imgFullscreen();
	});

	$( "a.smooth, .navbar.smooth a" ).each(function() {
		if($._data( this, "events" ) == null)
		{
			$(this).on('click', function(event) {
				if (this.hash !== "") {
					var hash = this.hash;
					if($(hash).length) {
						event.preventDefault();
						$('html, body').animate({
							scrollTop: $(hash).offset().top
						}, 900, function(){
							window.location.hash = hash;
						});
					}
				}
			});
		}
	});
}

$(document).ready(function() {
	initBrogitFeatures();
});

$(window).on('load',function() {
	$('.window-load').slideUp();
});

/**************
Toastr Notification
**************/
if(typeof toastr != "undefined") {
	toastr.options = {
	  "closeButton": false,
	  "debug": false,
	  "newestOnTop": true,
	  "progressBar": false,
	  "positionClass": "toast-bottom-left",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": 0,
	  "extendedTimeOut": 0,
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut",
	  "tapToDismiss": true
	}
}