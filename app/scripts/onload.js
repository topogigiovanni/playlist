$(window).load(function() {
	'use strict';
	//$('.modal-btn').modal();
	$searchModal = $body.find('.search-modal');
	var $playlist = $('#playlist');
	var $player = $('#' + PLAYER);
	var availHeight = screen.availHeight;
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
	var onResize = function() {
		adjustPlayerHeight();
		adjustPlaylistHeight();
	};
	//adjustIframeHeight();
	onResize();
	$(window).on('resize', onResize);

	//$('[data-toggle="tooltip"]').tooltip();

	var bindDropVideo = function() {
		var dropTarget = $('body'),
			$html = $('html'),
			showDrag = false,
			timeout = -1;

		$html.bind('dragenter', function() {
			dropTarget.addClass('dragging');
			showDrag = true;
			//console.log('dragenter');
		});
		$html.bind('dragover', function() {
			showDrag = true;
			//console.log('dragover');
		});
		$html.bind('drop', function(e,a,b) {
			showDrag = false;
			endDrag();
			console.log('drop', e,a,b);
		});
		$html.bind('dragleave', function(e) {
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