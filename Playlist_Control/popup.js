// Contants
var QUERY_URL = ["*://*.playlist.ws/*","http://localhost:9000/"];

// Vars
var tabs = [];
var state = {};
var api = {};
var debug = true;

state['playerPlay'] = false;
state['playerRepeat'] = false;
state['playerRandom'] = false;

// API
api.call = function(action, calback, singleCall){
	if(singleCall && tabs[0]){
		chrome.tabs.sendMessage(tabs[0].id, action, calback);
		return true;
	};
	tabs.forEach(function(t){
		if(debug)
  			console.log('foreach', t,t.id)
  		//chrome.tabs.executeScript(t.id,{code: e});

  		chrome.tabs.sendMessage(t.id, action, calback);
	});
	return true;
};
api.player = {};
api.player.adjust = function(o){
	if(!o)	return;
	if(o.playerPlay){
		$('#playerPlay i').addClass('glyphicon glyphicon-pause')
						.removeClass('play');
	}else{
		$('#playerPlay i').removeClass('glyphicon glyphicon-pause')
						.addClass('play');
	}
	if(o.playerRepeat){
		$('#playerRepeat').addClass('active');
	}else{
		$('#playerRepeat').removeClass('active');
	}
	if(o.playerRandom){
		$('#playerRandom').addClass('active');
	}else{
		$('#playerRandom').removeClass('active');
	}
	return;
};

// Class
function Action(action, data){
	this.action = action;
	this.data = data;
};

// Init
$(document).ready(function() {
	bindPlayer();
	bindForm();
	chrome.tabs.query({url:QUERY_URL}, function (t){
		if(debug)
			console.log('result query', t);
		//tabs.push(tab);
		tabs = t;
		var cb = function(response) {
				if(debug)
		   			console.log('Start get.player callback', response);
		   		if(response){
		   			$.extend(state, response);
		   			api.player.adjust(state);
		   		}
			};
		if(tabs.length){
			api.call(new Action('get.player'), cb);
		}else{
			var url = debug ? 'http://localhost:9000' : 'http://playlist.ws';
			chrome.tabs.create(
	          {url: url, active: false}, 
	          //{url: 'http://localhost:9000', active: false}, 
	          function(tab){
	          	tabs.push(tab);
	          	if(debug)
	            	console.log('tab created',tab);
	            setTimeout(
	            	(function(){
	            		api.call(new Action('get.player'), cb);
	            	})
	            , 3000);
	          }
	        );
		}
		api.call(new Action('get.player'), cb);
	});
	$('.videoUploader').focus();
});// end document.ready

// Methods
function bindPlayer(){
	$('#playerPlay').click(function(){
		var $this = $(this);
		state.playerPlay = !$this.find('i').hasClass('glyphicon-pause');
		api.player.adjust(state);
		api.call(new Action('set.player', {button:'#playerPlay', action:'click'}));
	});
	$('#playerRandom').click(function(){
		var $this = $(this);
		state.playerRandom = !$this.hasClass('active');
		api.player.adjust(state);
		api.call(new Action('set.player', {button:'#playerRandom', action:'click'}));
	});
	$('#playerRepeat').click(function(){
		var $this = $(this);
		state.playerRepeat = !$this.hasClass('active');
		api.player.adjust(state);
		api.call(new Action('set.player', {button:'#playerRepeat', action:'click'}));
	});
};
function bindForm(){
	// $('#addForm').submit(function(e){
	// 	e.preventDefault();
	// 	var url = $('#newVideo').val();
	// 	$('#newVideo').val('');
	// 	api.call(new Action('set.video', url));
	// });

	$('#addForm').submit(function(e){
		e.preventDefault();
		var term = $('#input').val();
		//$('#input').val('');
		api.call(new Action('get.search', term), null, true);
		highlightTab();
	});
};
function highlightTab(){
	chrome.windows.update(tabs[0].windowId, {focused: true});
	chrome.tabs.update(tabs[0].id, {highlighted: true});
}