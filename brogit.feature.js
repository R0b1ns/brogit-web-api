/*!
  * brogit feature v1.20.05 (https://brogit.de/)
  * 2017-2020 Copyright (c) brogit
  * Requirements: jQuery 3, Bootstrap 4, (optional) Moment.js, (optional) toastr
  */

  /* UPDATE INTEGRATE THIS */

  /*
$(document).ready(function() {
	//$('.navbar').affix({offset: {top: $('header').height()-56} });

	//bootstrap 3::affix replacement. NEED TO UPDATE to generic jquery plugin
	var object = $('.navbar');
	var top = $('header').height()-$('nav.navbar').outerHeight();

	var affix = function(e) {
		var object = e.data.object;
		var top = e.data.offset.top;

		var scrollTop = $(window).scrollTop();

		if (scrollTop > top || isNaN(top)) {
			object.removeClass('affix-top');
			object.addClass('affix');
		}
		else {
			object.removeClass('affix');
			object.addClass('affix-top');
		}
	}

	affix({data: {object: object, offset: {top: top}}});

	$(window).on('scroll', {object: object, offset: {top: top}}, affix);
});
  */

var showImgModal = function(title, imgurl, description) {
	if(!$('.bs-img-modal-lg').length) {
		$('body').append('<div class="modal fade bs-img-modal-lg" tabindex="-1" role="dialog" aria-labelledby="ImgModalFullscreen"><div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="ImgModalFullscreen"></h4><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button></div><div class="modal-body"><img class="img-fluid d-block mx-auto" src=""></div><div class="modal-footer"><div class="modal-description"></div><button type="button" class="btn btn-primary" data-dismiss="modal">Schließen</button></div></div></div></div>');
	}

	$('.bs-img-modal-lg .modal-title').html(title);
	$('.bs-img-modal-lg .modal-body img').prop('src', imgurl);
	$('.bs-img-modal-lg .modal-description').html(description);

	$('.bs-img-modal-lg').modal('show');
};

/**
 * Generic jQuery extensions
 */
$.fn.extend({
	imgFullscreen: function(name, url, description) {
		$(this).addClass('img-fullscreen');

		var name = name || $(this).data('name');
		var url = url || $(this).data('url');
		var description = description || $(this).data('description');

		$(this).data('name', name);
		$(this).data('url', url);
		$(this).data('description', description);

		if($._data( this, "events" ) == null) {
			$(this).on("click", {name:name, url:url, description:description}, function( event ) {
				showImgModal(name, event.data.url, event.data.description);
			});
		}

		return this;
	},
	fromNow: function(datetime) {
		$(this).addClass('moment-fromnow');

		var datetime = datetime || $(this).data('datetime');

		$(this).data('datetime', datetime);

		$(this).text(moment(datetime, "YYYY-MM-DD hh:mm:ss").fromNow());

		return this;
	},
	window_load: function() {
		$(this).addClass('window-load');
		$(this).html('<div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>');

		return this;
	},
	overlay: function(classes, html) {
		if(!$(this).parent().parent('.x-container').length) {
			$(this).wrap('<div class="x-container"><div class="x-content no-select ' + classes + '"></div></div>');
			var overlay = $('<div class="x-overlay" style="display:none;"></div>');
			overlay.html(html);
			$(this).parent().parent('.x-container').append(overlay);
			overlay.fadeIn();

			return overlay;
		}

		return this;
	},
	b_load: function(url, fragment) {
		$(this).addClass('b-load');

		url = url || $(this).data('url') || $(this).prop('href');

		if(!url) {
			console.warn('brogit.load: No url!');
			return false;
		}

		var link = $(this).prop('tagName') == 'A';

		link ? $(this).prop('href', url) : $(this).data('url', url);

		var container = link ? $('main#b-loaded') : $(this);
		var fragment = fragment || $(this).data('fragment') || '';
		$(this).data('fragment', fragment);

		var loadstr = url + ' ' + fragment;

		if(link) {
			var events = $._data( $(this).get(0), "events" );

			if(!(events != null && events.click)) {
				$(this).on('click', function(e) {
					e.preventDefault();

					$('main#b-content').hide();

					container.load(loadstr, function(responseText, textStatus, jqXHR) {
						if(textStatus == 'success') {
							var html = $(responseText);
							$.each( html, function( i, el ) {
								if(el.nodeName == 'TITLE') {
									window.history.pushState({'loadstr': loadstr, 'fragment': fragment}, $(el).text(), url);
									return false;
								}
							});
						}
					});
				});
			}
		}
		else {
			container.load(loadstr);
		}
	}
});

function initBrogitFeatures() {
	$('.window-load').window_load();

	//construct

	// UPDATE need a .anim-zoom-child-inverse to not scale a element in a container
	var anim_zoom = function() {
		var offsetTop = $(this).offset().top;
		var scrollTop = $(window).scrollTop();

		var height = $(this).height();
		var windowY = $(window).innerHeight();

		if( ( (offsetTop + height) > scrollTop ) && (offsetTop < (scrollTop + windowY)) )
		{
			var zoom = 1 + (0.2 * (1 - ( (offsetTop + height - scrollTop) / (windowY + height) )));
		$(this).css('transform', 'scale('+zoom+')');
		}
	};

	var anim_slide = function(){

		var posBot = $(this).offset().top + $(this).height();
		var scrollBot = $(window).scrollTop() + $(window).height();
		
		// trigger when bottom of element gets visible
		if (posBot < scrollBot) {
			$(this).addClass("slide-up");
		}
	};

	if((lang = $('html').prop('lang')) && (typeof moment != 'undefined')) {
		moment.locale(lang);
	}

	//init
	$(".anim-zoom").each(anim_zoom);
	$(".moment-fromnow").each(function(){
		$(this).fromNow();
	});
	$(".anim-slide").each(anim_slide);

	//eventhandling
	$(window).scroll(function() {
		$(".anim-zoom").each(anim_zoom);
	    $(".anim-slide").each(anim_slide);
	});

	// Initiator Generic imgFullscreen
	$( ".img-fullscreen" ).each(function() {
		$(this).imgFullscreen();
	});

	//Modify Page for b-load
	if($('.b-load').length) {
		$('body').wrapInner('<main id="b-content"></main>');
		$('body').append('<main id="b-loaded"></main>');

		$(window).on('popstate', function(e) {
			if(e.originalEvent.state) {
				$('main#b-content').hide();
				$('main#b-loaded').load(e.originalEvent.state.loadstr);
			}
			else {
				$('main#b-content').show();
				$('main#b-loaded').empty();
			}
		});
	}

	//Initiator Generic b-load
	$('.b-load').each(function() {
		$(this).b_load();
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

	//Initiate bootstrap / popper popovers
	$('[data-toggle="popover"]').popover();
}

$(document).ready(function() {
	initBrogitFeatures();
});

$(window).on('load',function() {
	$('.window-load').slideUp();
});

//ty to stackoverflow : cms
function delay(callback, ms) {
  var timer = 0;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}

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