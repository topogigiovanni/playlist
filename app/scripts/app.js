'use strict';

/**
 * @ngdoc overview
 * @name easylistApp
 * @description
 * # easylistApp
 *
 * Main module of the application.
 */
var app = angular
          .module('easylistApp', [
            'ngScrollbars',
            'wu.masonry'
            // 'ngAnimate',
            // 'ngCookies',
            // 'ngResource',
            // 'ngRoute',
            // 'ngSanitize',
            // 'ngTouch'
          ]);
          // .config(function ($routeProvider) {
          //   $routeProvider
          //     .when('/', {
          //       templateUrl: 'views/main.html',
          //       controller: 'MainCtrl',
          //       controllerAs: 'main'
          //     })
          //     .when('/about', {
          //       templateUrl: 'views/about.html',
          //       controller: 'AboutCtrl',
          //       controllerAs: 'about'
          //     })
          //     .otherwise({
          //       redirectTo: '/'
          //     });
          // });
var $injector = angular.injector(['ng']);
var $body = $('body');
var $playlist = $body.find('#playlist');
var $searchModal = $body.find('.search-modal');
// TODO resgatar lista do Storage
var videoList = [];
// TODO limpar variavel inicial
var currentVideo = {};

// Constantes
var PLAYER = "player1";
var KEYS = [];
KEYS['youtube'] = 'AIzaSyDdNn7Fj9e0_gIURLfIDm9Cg8ubNzhmmQU%20';
KEYS['vimeo'] = '2f0714bfa2df9de7e74703c0b8c7df1e';

var helper = {};
helper.Date = {};
helper.Date.convertISO8601ToSeconds = function(input){
  var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  var hours = 0, minutes = 0, seconds = 0, totalseconds;
  if (reptms.test(input)) {
      var matches = reptms.exec(input);
      if (matches[1]) 
        hours = Number(matches[1]);
      if (matches[2]) 
        minutes = Number(matches[2]);
      if (matches[3])
       seconds = Number(matches[3]);
      
      totalseconds = hours * 3600  + minutes * 60 + seconds;
  }
  return (totalseconds);
};
helper.Date.formatDecimal = function(n){
  if((n+'').length == 1){
    return '0'+n;
  }
  return n;
};
helper.Date.secondsToStringFormatted = function(time){
  //console.log('secondsToStringFormatted', time);
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  //console.log('secondsToStringFormatted minutes', minutes);
  //console.log('secondsToStringFormatted seconds', seconds);

  if(minutes > 60){
    var hours = Math.floor(time / 3600);
    seconds = time - hours * 3600;
    minutes = Math.floor(seconds / 60);
    seconds = time - minutes * 60;
    return helper.Date.formatDecimal(hours)+':'+helper.Date.formatDecimal(minutes)+':'+helper.Date.formatDecimal(seconds);
  }else{
    return '00:'+helper.Date.formatDecimal(minutes)+':'+helper.Date.formatDecimal(seconds);
  }

};
helper.Url = {};
helper.Url.removeProtocol = function(url){
  if(!!~url.indexOf('https://'))
      return url.replace('https://', '');
  if(!!~url.indexOf('http://'))
      return url.replace('http://', '');
  if(url.substring(0, 2) === '//')
    return url.replace('//','');
  return url;
};
helper.Url.isYoutube = function(url){
  return  !!~url.indexOf("youtu.be") || !!~url.indexOf("youtube");
};
helper.Url.isVimeo = function(url){
  return  (!!~url.indexOf("vimeo"));
};
helper.Url.getOrigin = function(url){
  if(helper.Url.isYoutube(url))
    return 'youtube';
    else if(helper.Url.isVimeo(url))
      return 'vimeo';
    return '';
};
helper.Url.getID = function(url){
  // url = helper.Url.removeProtocol(url);
  // // split querystring
  // url = url.split('?')[0];
  // split / 

  var link = document.createElement('a');
  link.href = url;
  var path = link.pathname;
  if(path.substring(0, 1) === '/'){
    path = path.replace('/','');
  }
  return path.split('/')[0];
};
helper.Url.getParameterByName = function(url, name){
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(url);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

var Player = {};
Player.Youtube = {};
Player.Youtube.call = function(frame_id, func, args){
  if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
  var iframe = document.getElementById(frame_id);
  if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
      iframe = iframe.getElementsByTagName('iframe')[0];
  }
  if (iframe) {
      // Frame exists, 
      iframe.contentWindow.postMessage(JSON.stringify({
          "event": "command",
          "func": func,
          "args": args || [],
          "id": frame_id
      }), "*");
  }
};
Player.Youtube.instance = null;
Player.Youtube.newInstance = function(id){
  return new YT.Player(PLAYER, {
          videoId: id,
          events: {
            'onStateChange': Player.Youtube.OnPlayerStateChange
          }
        });
};
Player.Youtube.OnPlayerStateChange = function(e){
  console.log('youtube play onPlayerStateChange', e);
  // stop/finish
  if(e.data === 0){
    $body.trigger('PlayerStatePause');
    // mudar para próximo vídeo
    $body.trigger('PlayerStateChangeNext');
  }
  // play
  if(e.data === 1){    
    $body.trigger('PlayerStatePlay');
  }
  // pause
  if(e.data === 3 || e.data === 2 || e.data === -1){
    // console.log('Player.Youtube.OnPlayerStateChange pause data 2');
    // $injector.invoke(function($rootScope) {
    //   console.log('Player.Youtube.OnPlayerStateChange data 2 invoke', $rootScope);
    //   $rootScope.$broadcast('Player.Pause', {});
    // });
    
    $body.trigger('PlayerStatePause');
  }
  
};
Player.Vimeo = {};

function VimeoVideo(url, callback){
  var id = null;
  if(!!~url.indexOf('vimeo')){
    id = helper.Url.getID(url);
  }
  console.log('vimeo id',url,id);
  this.id = id;
  this.media = {
    small: '',
    big: ''
  };
  this.iframeSrc = 'https://player.vimeo.com/video/'+id+'?api=1&player_id=player1&autoplay=1';
  this.title = {};
  this.instance = {};
  $.ajax({
      type:'GET',
      url: 'http://vimeo.com/api/v2/video/' + id + '.json',
      jsonp: 'callback',
      dataType: 'jsonp',
      success: callback
  });
};

function YoutubeVideo(url, callback){
  var id = null;
  if(!!~url.indexOf('youtube')){
    id = helper.Url.getParameterByName(url, 'v');
  }else if(!!~url.indexOf('youtu.be')){
    id = helper.Url.getID(url);
  }
  this.id = id;
  this.media = {
    small: 'http://img.youtube.com/vi/'+id+'/default.jpg',
    big: 'http://img.youtube.com/vi/'+id+'/maxresdefault.jpg'
  };
  this.iframeSrc = 'http://www.youtube.com/embed/'+id+'?enablejsapi=1&autoplay=1&version=3&controls=2&rel=0&modestbranding=1&disablekb=1&fs=1&iv_load_policy=3';
  // var instance = new YT.Player('player1', {
  //   videoId: id,
  //   events: {
  //     'onStateChange': Player.Youtube.OnPlayerStateChange
  //   }
  // });
  this.title = "";
  // $.get('https://www.googleapis.com/youtube/v3/videos?id='+id+'&key=AIzaSyDdNn7Fj9e0_gIURLfIDm9Cg8ubNzhmmQU%20&part=snippet&fiel=title', function(r){
  //   console.log(r);
  //   callback(r);
  // });
 $.get('https://www.googleapis.com/youtube/v3/videos?id='+id+'&key='+KEYS['youtube']+'&part=snippet,contentDetails&fiel=title', 
    callback
    );

  // nova instancia de youtube
  var instance = Player.Youtube.newInstance(id);
  this.instance = instance;
  //console.log('asasd', instance.B);

};
// TODO estudar passar para o angular factory
function Video(url, callback){
  callback = (typeof callback == 'function') ?
              callback : function(){};
  var self = this;
  this.originalUrl = url;
  var origin = helper.Url.getOrigin(url);
  //var id = helper.Url.getID(url) || null;
  var isValid = false;
  var originModel = {};
  
  if(origin == 'vimeo'){
    isValid = true;
    var cb = function(data){ 
      console.log(data);
      if(data && data.length){
        var v = data[0];
        self.title = v.title;
        self.media = {
          small: v.thumbnail_medium,
          big: v.thumbnail_large
        };
        self.duration = new VideoDuration(v.duration);
      }else{
        self.isValid= false;
      }
      callback(data);
    };
    originModel = new VimeoVideo(url, cb);
  }else if(origin == 'youtube'){
    isValid = true;
    var cb = function(r){ 
      console.log('cb',r);
      //self.title = r.items[0].snippet.title;
      if (r && r.items && r.items.length) {
        self.title = r.items[0].snippet.title;
        var duration = r.items[0].contentDetails.duration,
            seconds = helper.Date.convertISO8601ToSeconds(duration);
        //console.log('tyoutube video title', self.title);
        //console.log('tyoutube video duration', seconds, duration);
        helper.Date.secondsToStringFormatted(seconds);

        self.duration = new VideoDuration(duration);

      }else{
        self.isValid = isValid = false;
      }

      callback(r);
      
    };
    originModel = new YoutubeVideo(url, cb);
  }
  
  this.isValid = isValid;
  this.title = originModel.title;
  this.id = originModel.id;
  this.origin = origin; // Youtube/Vimeo
  this.iframeSrc = originModel.iframeSrc;
  this.instance = originModel.instance;
  this.media = {
    small: originModel.media ? originModel.media.small : null,
    big: originModel.media ? originModel.media.big : null
  };
}; 

function VideoDuration(duration){
  this.originalValue = duration;
  var seconds = 0
  if(typeof duration == 'string'){
    seconds = this.seconds = helper.Date.convertISO8601ToSeconds(duration);
  }else if(typeof duration == 'number'){
    seconds = this.seconds = duration;
  }
  
  this.formatted = helper.Date.secondsToStringFormatted(seconds);
};

function SearchResultItem(id, origin, title, image, url, duration){
  this.id = id;
  this.title = title;
  this.image = image;
  this.origin = origin;
  this.url = url;
  // api youtube não suporte, teria q fazer 2 ajax
  //this.duration = helper.Date.secondsToStringFormatted(duration);
};


// function onYouTubeIframeAPIReady(a,b,c,d) {
//     // player = new YT.Player('ytplayer', {
//     //   height: '390',
//     //   width: '640',
//     //   videoId: 'M7lc1UVf-VE'
//     // });
//     console.log('onyoutube iframe ready',a,b,c,d);
// };

// function onYouTubePlayerAPIReady(a,b,c,d) {
//     // player = new YT.Player('ytplayer', {
//     //   height: '390',
//     //   width: '640',
//     //   videoId: 'M7lc1UVf-VE'
//     // });
//     console.log('onyoutube ready',a,b,c,d);
// };

app.config(function (ScrollBarsProvider) {
  // scrollbar defaults
  ScrollBarsProvider.defaults = {
    autoHideScrollbar: false,
    setHeight: 352, //100
    scrollInertia: 0,
    axis: 'y',
    advanced: {
      updateOnContentResize: true
    },
    scrollButtons: {
      scrollAmount: 'auto', // scroll amount when button pressed
      enable: false // enable scrolling buttons by default
    }
  };

  // $rootScope.$on('CurrentVideo.Changed', function(e,a){
  //     console.log('e a',e,a);
  // });
});

$(window).load(function(){
  //$('.modal-btn').modal();
  $searchModal = $body.find('.search-modal');
});