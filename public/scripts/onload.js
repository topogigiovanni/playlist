$(window).load(function() {
	'use strict';
    
    //Inicia sliders(intro)
    $('.intro-slider').responsiveSlides({
        auto: true, // Boolean: Animate automatically, true or false
        speed: 500, // Integer: Speed of the transition, in milliseconds
        timeout: 8000, // Integer: Time between slide transitions, in milliseconds
        pager: false, // Boolean: Show pager, true or false
        nav: false, // Boolean: Show navigation, true or false
        random: true, // Boolean: Randomize the order of the slides, true or false
        pause: false, // Boolean: Pause on hover, true or false
        pauseControls: false, // Boolean: Pause when hovering controls, true or false
        maxwidth: "", // Integer: Max-width of the slideshow, in pixels
        namespace: "introSlider", // String: Change the default namespace used
        before: function () {}, // Function: Before callback
        after: function () {} // Function: After callback
    });
    
	//$('.modal-btn').modal();
	$searchModal = $body.find('.search-modal');
	var $playlist = $('#playlist');
	var $player = $('#' + PLAYER);
	var availHeight = screen.availHeight;
    var availWidth = screen.availWidth;
	var adjustPlayerHeight = function() {
		var h = availHeight - $('#header').height() - 100;
		$player.height(h);
	};
	var adjustPlaylistHeight = function() {
		//console.debug('adjustPlaylistHeight availHeight',availHeight, 'videoUploader videoCtrl', $('#videoUploader').height() , $('#videoCtrl').height() )
		var h = availHeight - $('#videoUploader').height() - 110 - $('#videoCtrl').height() - 100;
		$playlist.height(h);
		//$('#VideoList').height(h);
	};
    var adjustMainContainerWidth = function(){
        var w = availWidth - $('.sidebar-custom').width();
        console.log('adjustMainContainerWidth', availWidth, w);
        $('.main-container').width(w);
    };
	var onResize = function() {
        //adjustMainContainerWidth();
		adjustPlayerHeight();
		adjustPlaylistHeight();
	};
	//adjustIframeHeight();
	onResize();
	$(window).on('resize', onResize);
	$body.on('Screen.Resize', function(){
		setTimeout(onResize, 140);
	});

	//$('[data-toggle="tooltip"]').tooltip();

	var bindDropVideo = function() {
		var dropTarget = $('#dragContainer'),
			$html = $('html'),
			showDrag = false,
			timeout = -1;

		$html.bind('dragenter', function(e) {
			e.preventDefault();
			dropTarget.addClass('dragging');
			showDrag = true;
			//console.log('dragenter');
		});
		$html.bind('dragover', function(e) {
			e.preventDefault();
			showDrag = true;
			//console.log('dragover');
		});
		$html.bind('drop', function(e) {
			//e = e.originalEvent;
			e.preventDefault();
			showDrag = false;
			endDrag();
			console.log('e.originalEventdrop', e);
			var link = e.originalEvent.dataTransfer.getData('Text');
			
			if(link){
				console.log('drop link', link);
				$body.trigger('AddToVideoList', {url: link});
			};

		});
		$html.bind('dragleave', function(e) {
			e.preventDefault();
			showDrag = false;
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				if (!showDrag) {
					endDrag();
				}
			}, 200);
			//console.log('dragleave');
		});

		var endDrag = function() {
			dropTarget.removeClass('dragging');
		};
	};
	bindDropVideo();

});