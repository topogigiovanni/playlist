//https://developer.chrome.com/extensions/content_scripts#host-page-communication
//http://stackoverflow.com/questions/11752341/chrome-extension-communication-between-content-script-and-background-html
//https://developer.chrome.com/extensions/messaging
//http://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page
//https://metabroadcast.com/blog/script-communication-in-a-chrome-extension

$jq = jQuery.noConflict();
//var terms = ['bbb', 'Novela', 'praia', 'pessoas', 'pessoa'];
var terms = '';
var $player = $jq('#player');
var removeds = 0;
var $host = window.location.host;
var tagName = '';
var _debug = true;
var val = '';



if($player && $host.indexOf('playlist.ws') != -1){
	chrome.storage.local.get('gControl', function(tags) {
		//alert('enbtrou');
		if(_debug == true)
		console.log('gControl run..');
		
		if(_debug == true)		
		console.log('tags',tags);


		//filterFeed();
		syncPlayerStatus();
		bindPlayerChanges();
		
	})
	
}
function bindPlayerChanges(){
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if(_debug == true){
			console.log('changes',changes,'namespace',namespace);
			console.log('changes.gControl.newValue',changes.gControl.newValue,'namespace',namespace);
		}
		val = changes.gControl.newValue;
		$jq('body').trigger('changeVal');
	});

	
}
function syncPlayerStatus(){

	//var bgWindowObject = chrome.extension.getBackgroundPage();

	console.log('bgWindowObject', bgWindowObject);
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


$jq(document).ready(function(){
	$jq('body').on('changeVal', function(){
		switch (val) {
			case 'prev':
				document.getElementById('play-prev').click();
				break;
			case 'next':
				document.getElementById('play-next').click();
				break;
			case 'play':
				document.getElementById('play-pause').click();
				break;
		}
		syncPlayerStatus();
	});
	console.log('ready');
	
})


