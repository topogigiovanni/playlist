// Contants
var QUERY_URL = ["*://*.playlist.ws/*","http://localhost:9000/"];

// Vars
var tabs = [];
var state = {};
var api = {};
var debug = false;

state['playerPlay'] = false;
state['playerRepeat'] = false;
state['playerRandom'] = false;

// API
api.call = function(action, calback){
	tabs.forEach(function(t){
		if(debug)
  			console.log('foreach', t,t.id)
  		//chrome.tabs.executeScript(t.id,{code: e});

  		chrome.tabs.sendMessage(t.id, action, calback);
	});
};
api.player = {};
api.player.adjust = function(o){
	if(!o)	return;
	if(o.playerPlay){
		$('#playerPlay i').addClass('glyphicon-pause')
						.removeClass('glyphicon-play');
	}else{
		$('#playerPlay i').removeClass('glyphicon-pause')
						.addClass('glyphicon-play');
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
		   			console.log('Start action sent-- response',response);
		   		if(response){
		   			$.extend(state, response);
		   			api.player.adjust(state);
		   		}
			};
		if(tabs.length){
			api.call(new Action('get.player'), cb);
		}else{
			chrome.tabs.create(
	          {url: 'http://playlist.ws', active: false}, 
	          //{url: 'http://localhost:9000', active: false}, 
	          function(tab){
	          	tabs.push(tab);
	          	if(debug)
	            	console.log('tab created',tab);
	            setTimeout(
	            	(function(){
	            		api.call(new Action('get.player'), cb);
	            	})
	            , 1000);
	          }
	        );
		}
		api.call(new Action('get.player'), cb);
	});
});

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
	$('#addForm').submit(function(e){
		e.preventDefault();
		var url = $('#newVideo').val();
		$('#newVideo').val('');
		api.call(new Action('set.video', url));
	});
};