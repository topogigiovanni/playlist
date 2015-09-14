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
var helper = {};

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
  return  !!~url.indexOf("youtube");
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
    path.replace('/','');
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
Player.Youtube.OnPlayerStateChange = function(e){
  console.log('youtube play onPlayerStateChange', e);
  // stop
  if(e.data === 0){
    // mudar para próximo vídeo
  }
  // play
  if(e.data === 1){
    console.log('Player.Youtube.OnPlayerStateChange play data 1');
    
    // $injector.invoke(function($rootScope) {
    //   console.log('Player.Youtube.OnPlayerStateChange data 1 invoke', $rootScope);
    //   $rootScope.$broadcast('Player.Play', {});
    // });
    // $injector.invoke(function($rootScope) {
    //   $rootScope.$broadcast('Player.Play', {});
    // });
    
    $body.trigger('PlayerStatePlay');
  }
  // pause
  if(e.data === 2){
    // console.log('Player.Youtube.OnPlayerStateChange pause data 2');
    // $injector.invoke(function($rootScope) {
    //   console.log('Player.Youtube.OnPlayerStateChange data 2 invoke', $rootScope);
    //   $rootScope.$broadcast('Player.Pause', {});
    // });
    
    $body.trigger('PlayerStatePause');
  }
  
};
Player.Vimeo = {};

// TODO resgatar lista do Storage
var videoList = [];
// TODO limpar variavel inicial
var currentVideo = {iframeSrc:'asdasd'};

function VimeoVideo(id){

};

function YoutubeVideo(url){
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
  var instance = new YT.Player('player1', {
    videoId: id,
    events: {
      'onStateChange': Player.Youtube.OnPlayerStateChange
    }
  });
  instance.addEventListener('onStateChange', function(a,b,c){
    console.log('fakee listenrr', a,b,c);
  });
  this.instance = instance;
  console.log('asasd', instance.B);

};

function Video(url){
  this.originalUrl = url;
  var origin = helper.Url.getOrigin(url);
  var id = helper.Url.getID(url) || null;
  var isValid = false;
  var originModel = {};
  
  if(origin == 'vimeo'){
    isValid = true;
    originModel = new VimeoVideo(url);
  }else if(origin == 'youtube'){
    isValid = true;
    originModel = new YoutubeVideo(url);
  }
  
  this.isValid = isValid;
  this.ID = originModel.id;
  this.origin = origin; // Youtube/Vimeo
  this.iframeSrc = originModel.iframeSrc;
  this.instance = originModel.instance;
  this.media = {
    small: originModel.media ? originModel.media.small : null,
    big: originModel.media ? originModel.media.big : null
  };
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

$(function() {
  var iframe = $('#player1')[0];
  var player = $f(iframe);
  var status = $('.status');

  // When the player is ready, add listeners for pause, finish, and playProgress
  player.addEvent('ready', function() {
    status.text('ready');

    player.addEvent('pause', onPause);
    player.addEvent('finish', onFinish);
    player.addEvent('playProgress', onPlayProgress);
  });

  // Call the API when a button is pressed
  $('button').bind('click', function() {
    player.api($(this).text().toLowerCase());
  });

  function onPause(id) {
    status.text('paused');
  }

  function onFinish(id) {
    status.text('finished');
  }

  function onPlayProgress(data, id) {
    status.text(data.seconds + 's played');
  }
});