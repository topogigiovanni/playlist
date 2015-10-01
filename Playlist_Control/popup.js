var RESULTS = '';
document.addEventListener('DOMContentLoaded', function () {
  load();

});


/*


chrome.storage.onChanged.addListener(function(changes, namespace) {
//alert('change');

  location.reload();
});
*/
var $prev,
	$play,
	$next;
function load(){
		
	//loadItems();
}

function loadItems(){

	//tags = StorageArea.get();
	//console.log(tags);
	
// Save it using the Chrome extension storage API.
var dataObj = '';
var i='';
  chrome.storage.sync.get('gMusic', function(tags) {
	console.log('tags',tags);
	if(tags.music)
	$('.music').html(tags.music);

	if(tags.img)
	$('.music').append(tags.img);
  });
}
function sendCommand(command){
	chrome.storage.sync.set( {'gControl': command}, function() {
    // Notify that we saved.
		//message('Settings saved');
	});
	//reload();
}
function reload(){
	window.location.reload();
}
Array.prototype.remove = function(start, end) {
  this.splice(start, end);
  return this;
}
$(document).ready(function(){

	$('.appearModal').click(function(){
		$( "#myModal" ).slideToggle( "slow" );
	})
	$('.closeModal').click(function(){
		$( "#myModal" ).slideUp( "slow" );
	})
	//save('');
	$prev = $('#prev');
	$play = $('#play');
	$next = $('#next');

	$prev.click(function(){
		sendCommand('prev');
	});
	$play.click(function(){
		sendCommand('play');
	});
	$next.click(function(){
		sendCommand('next');
	});
		
})
$(document).foundation();