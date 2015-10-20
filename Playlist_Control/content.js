//https://developer.chrome.com/extensions/content_scripts#host-page-communication
//http://stackoverflow.com/questions/11752341/chrome-extension-communication-between-content-script-and-background-html
//https://developer.chrome.com/extensions/messaging
//http://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page
//https://metabroadcast.com/blog/script-communication-in-a-chrome-extension
//https://developer.chrome.com/extensions/tabs


var app = {};
app.debug = true;
app.error = [];
var cl = function(){return;};
if(app.debug)
	cl = function(){console.log.apply(console, arguments)};

var $body,
	api,
	controller;

api = {};
api.video = {};
api.video.set = function(url){
	$
};

controller = function(request){

	if(!request || !request.action) return;
	switch(request.action){
		case 'set.video':
			$('#newVideo').val(request.data).trigger('change');
			$('#newVideoBtn').trigger('click');
			break;
	};
};
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('extension onMessage content.js',request, sender, sendResponse);
      //sendResponse({farewell: "goodbye"});
    controller(request)
});

$(document).ready(function(){
	$body = $('body');
});

/* ============================================================= */



//var terms = ['bbb', 'Novela', 'praia', 'pessoas', 'pessoa'];
var terms = '';
var $player = $('#player');
var removeds = 0;
var $host = window.location.host;
var tagName = '';
var val = '';
var $body;

// chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
//     console.log('addListener', request);
//     if(request.action)
// {
//     alert('The response is : ' + request.action);
// }
// });



if($player && $host.indexOf('playlist.ws') != -1){
	chrome.storage.local.get('gControl', function(tags) {
		//alert('enbtrou');
		if(app.debug == true)
		console.log('gControl run..');
		
		if(app.debug == true)		
		console.log('tags',tags);


		//filterFeed();
		syncPlayerStatus();
		bindPlayerChanges();
		
	})
	
}
function bindPlayerChanges(){
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if(app.debug == true){
			console.log('changes',changes,'namespace',namespace);
			console.log('changes.gControl.newValue',changes.gControl.newValue,'namespace',namespace);
		}
		val = changes.gControl.newValue;
		$('body').trigger('changeVal');
	});

	
}
function syncPlayerStatus(){

	//var bgWindowObject = chrome.extension.getBackgroundPage();

	//console.log('bgWindowObject', bgWindowObject);
	// var command = {};
	// var img_playing = $player.find('#now-playing-image');
	// if(img_playing.hasClass('hide')){
	// 	command.music = false;
	// }else{
	// 	var music = $player.find('.now-playing-link.artist').text()+' '+$player.find('.now-playing-link.song');
	// 	command.music = music;
	// 	command.img = img_playing.html();
	// }

	// chrome.storage.sync.set( {'gMusic': command}, function() {
	// });
}
function objBlock(num){
	var var_ = '<div data-g-show="'+num+'" class="g-show" style="background:#f6f9ff;cursor:pointer;color:#4B67A1;"><h4 style="color:#4B67A1;">FeedBlock - Bloqueado, click para ver</h4></div>';
	return var_;
}


$(document).ready(function() {
	$body = $('body');

	// $('body').on('changeVal', function() {
	// 	switch (val) {
	// 		case 'prev':
	// 			document.getElementById('play-prev').click();
	// 			break;
	// 		case 'next':
	// 			document.getElementById('play-next').click();
	// 			break;
	// 		case 'play':
	// 			document.getElementById('play-pause').click();
	// 			break;
	// 	}
	// 	syncPlayerStatus();
	// });
	
	

	function startExtension() {
		console.log('Starting Extension');
		$body.trigger('Api.Set',{er:'teste'});
		//console.log('Conn',Conn);

		chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
		  console.log(response.farewell);
		});
	}

	function stopExtension() {
		console.log('Stopping Extension');
	}

	function onRequest(request, sender, sendResponse) {
		console.log('content.js',request,sender,sendResponse);
		if (request.action == 'start')
			startExtension()
		else if (request.action == 'stop')
			stopExtension()
		sendResponse({});
	}

	chrome.extension.onMessage.addListener(onRequest);


	$('body').on('ttt', function(){
		alert('asasasasttt');
	});

	function injectScript(file, node) {
	    var th = document.getElementsByTagName(node)[0];
	    var s = document.createElement('script');
	    s.setAttribute('type', 'text/javascript');
	    s.setAttribute('src', file);
	    s.onload = function(){
	    	cl('s load');
	    }
	    th.appendChild(s);
	}
	injectScript( chrome.extension.getURL('/connect.js'), 'body');

	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	  console.log(response.farewell);
	});

});


//funciona tb
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log('onMessage content.js',request, sender, sendResponse);
    
//       //sendResponse({farewell: "goodbye"});
//   });

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('extension onMessage content.js',request, sender, sendResponse);
    
      //sendResponse({farewell: "goodbye"});
  });
