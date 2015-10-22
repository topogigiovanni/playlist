//https://developer.chrome.com/extensions/content_scripts#host-page-communication
//http://stackoverflow.com/questions/11752341/chrome-extension-communication-between-content-script-and-background-html
//https://developer.chrome.com/extensions/messaging
//http://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page
//https://metabroadcast.com/blog/script-communication-in-a-chrome-extension
//https://developer.chrome.com/extensions/tabs


var app = {};
app.debug = false;
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
	if(app.debug) console.log('api.video.set', url);
	if(!url) return;
	$('#newVideo').val(url).trigger('change');
	$('#newVideoBtn').trigger('click');
	return true;
};
api.player = {};
api.player.get = function(){
	var r = {};
	r['playerPlay'] = $('#playerPlay i').hasClass('glyphicon-pause');
	r['playerRepeat'] = $('#playerRepeat').hasClass('active');
	r['playerRandom'] = $('#playerRandom').hasClass('active');
	return r;
};
api.player.set = function(data){
	if(!data) return;
	var $el = $(data.button);
	if($el.length && $el[data.action])
		$el[data.action]();
};

controller = function(request, sender, sendResponse){
	console.log('extension onMessage content.js',request, sender, sendResponse);
	if(!request || !request.action) return;
	switch(request.action){
		case 'set.video':
			api.video.set(request.data);
			break;
		case 'get.player':
			sendResponse(api.player.get());
			break;
		case 'set.player':
			api.player.set(request.data);
			break;
	};
};
chrome.extension.onMessage.addListener(controller);

$(document).ready(function(){
	$body = $('body');
});
