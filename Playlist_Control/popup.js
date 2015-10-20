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
	// $play.click(function(){
	// 	sendCommand('play');
	// });
	$next.click(function(){
		sendCommand('next');
	});
		
})
//$(document).foundation();

// teste!!!!!!!
var tabs = [];
chrome.tabs.query({url:["*://*.playlist.ws/*","http://localhost:9000/"]}, function (t){
	console.log('result query', t);
	//tabs.push(tab);
	tabs = t;
});

function click(e) {
  // chrome.tabs.executeScript(null,
  //     //{code:"document.body.style.backgroundColor='" + e.target.id + "'"});
		// {code: e});
  //window.close();

  //chrome.extension.sendRequest({ action: "WhatYouWant"});

chrome.runtime.sendMessage({greeting: "popup.js click()"}, function(response) {
		  console.log(response.farewell);
		});

  tabs.forEach(function(t){
  		console.log('foreach', t,t.id)
  		//chrome.tabs.executeScript(t.id,{code: e});

  		chrome.tabs.sendMessage(t.id, {action:'start'}, function(response) {
	   		console.log('Start action sent');
		});
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // var divs = document.querySelectorAll('div');
  // for (var i = 0; i < divs.length; i++) {
  //   divs[i].addEventListener('click', click);
  // }
  	$play = $('#play');
  	$play.click(function(){
		click("console.log('rodoou')");
	});
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('extension onMessage popup.js',request, sender, sendResponse);
    
      //sendResponse({farewell: "goodbye"});
  });