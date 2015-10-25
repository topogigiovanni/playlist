//https://developer.chrome.com/extensions/content_scripts#host-page-communication
//http://stackoverflow.com/questions/11752341/chrome-extension-communication-between-content-script-and-background-html
//https://developer.chrome.com/extensions/messaging
//http://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page
//https://metabroadcast.com/blog/script-communication-in-a-chrome-extension
//https://developer.chrome.com/extensions/tabs

var KEYS = [];
KEYS['youtube'] = 'AIzaSyDdNn7Fj9e0_gIURLfIDm9Cg8ubNzhmmQU%20';
KEYS['vimeo'] = '2f0714bfa2df9de7e74703c0b8c7df1e';

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
// não usado
api.video.set = function(url){
	if(app.debug) console.log('api.video.set', url);
	if(!url) return;
	$('#mainInput').val(url).trigger('change');
	$('#mainInputBtn').trigger('click');
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
api.search = {};
api.search.get = function(term){
	console.log('api.search.get', term);

	if(!term) return;
	$search = $('#search');
	$search.find('input').val(term).trigger('change');
	$('#mainInput').val(term).trigger('change');
	$('#search-input').val(term).trigger('change');
	//$search.find('button').trigger('click');
	$('#mainInputBtn').trigger('click');
	//$('#api-send-search').trigger('click');

};
api.search.response = null;
api.search.requestCount = 0;
api.search.checkResult = function(){

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
		case 'get.search':
			api.search.get(request.data);
			break;
	};
};
chrome.extension.onMessage.addListener(controller);

$(document).ready(function(){
	$body = $('body');
});
