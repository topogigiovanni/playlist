'use strict';

/**
 * @ngdoc overview
 * @name playlistApp
 * @description
 * # playlistApp
 *
 * Main module of the application.
 */
 
var app = angular
          .module('playlistApp', [
            'ngSanitize',
            'ngResource',
            'ngCookies',
            'ngScrollbars',
            'wu.masonry',
            'as.sortable',
            'angular-images-loaded',
            'ui.bootstrap'
          ]);
var $injector = angular.injector(['ng']);
var $body = $('body');
var $playlist = $body.find('#playlist');
var $searchModal = $body.find('.search-modal');

var currentPlaylist = new Playlist();
// TODO resgatar lista do Storage
var originalVideoList = [];
var videoList = []; //originalVideoList; 
var currentVideo = {};

// Constants
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
  return (n+'').substr(0, 2);
};
helper.Date.secondsToStringFormatted = function(time){
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  if(minutes > 60){
    var hours = Math.floor(time / 3600);
    seconds = time - hours * 3600;
    minutes = Math.floor(seconds / 60);
    seconds = time - minutes * 60;
    return helper.Date.formatDecimal(hours)+':'+helper.Date.formatDecimal(minutes)+':'+helper.Date.formatDecimal(seconds);
  }else{
    return helper.Date.formatDecimal(minutes)+':'+helper.Date.formatDecimal(seconds);
    //return '00:'+helper.Date.formatDecimal(minutes)+':'+helper.Date.formatDecimal(seconds);
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

app.config(function ($httpProvider, ScrollBarsProvider) {
  // scrollbar defaults
  ScrollBarsProvider.defaults = {
    autoHideScrollbar: false,
    setHeight: 352, //100
    scrollInertia: 0,
    axis: 'y',
    advanced: {
      updateOnContentResize: true
      //,releaseDraggableSelectors: "#playlist li img" 
    },
    scrollButtons: {
      scrollAmount: 'auto', // scroll amount when button pressed
      enable: false // enable scrolling buttons by default
    }
  };

  $httpProvider.interceptors.push('authInterceptor');
});

function unLogfb(){
  FB.api('/me/permissions', 'DELETE', function(res){
      if(res === true){
          console.log('app deauthorized');
      }else if(res.error){
          console.error(res.error.type + ': ' + res.error.message);
      }else{
          console.log(res);
      }
  });
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    console.log('resposta da modal de oAuth fb', response);
    FB.api('/me?fields=email,name', function(userInfo) {
        console.log(userInfo.name + ': ' + userInfo.email);
    });
  });
}

// Remover
// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
// function testAPI() {
//   console.log('Welcome!  Fetching your information.... ');
//   FB.api('/me', function(response) {
//     console.log('Successful login for: ' + response.name);
//     document.getElementById('status').innerHTML =
//       'Thanks for logging in, ' + response.name + '!';
//   });
// };
// function statusChangeCallback(response) {
//   console.log('statusChangeCallback');
//   console.log(response);
//   // The response object is returned with a status field that lets the
//   // app know the current login status of the person.
//   // Full docs on the response object can be found in the documentation
//   // for FB.getLoginStatus().
//   if (response.status === 'connected') {
//     // Logged into your app and Facebook.
//     testAPI();
//   } else if (response.status === 'not_authorized') {
//     // The person is logged into Facebook, but not your app.
//     document.getElementById('status').innerHTML = 'Please log ' +
//       'into this app.';
//   } else {
//     // The person is not logged into Facebook, so we're not sure if
//     // they are logged into this app or not.
//     document.getElementById('status').innerHTML = 'Please log ' +
//       'into Facebook.';
//   }
// }

// // This function is called when someone finishes with the Login
// // Button.  See the onlogin handler attached to it in the sample
// // code below.
// function checkLoginState() {
//   FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
//   });
// }

// window.fbAsyncInit = function() {
//   FB.init({
//     appId: '1500768470237803',
//     cookie: true, // enable cookies to allow the server to access 
//     // the session
//     xfbml: true, // parse social plugins on this page
//     version: 'v2.2' // use version 2.2
//   });
//     console.log('fbAsyncInit', FB);

//     // Now that we've initialized the JavaScript SDK, we call 
//     // FB.getLoginStatus().  This function gets the state of the
//     // person visiting this page and can return one of three states to
//     // the callback you provide.  They can be:
//     //
//     // 1. Logged into your app ('connected')
//     // 2. Logged into Facebook, but not your app ('not_authorized')
//     // 3. Not logged into Facebook and can't tell if they are logged into
//     //    your app or not.
//     //
//     // These three cases are handled in the callback function.

//     FB.getLoginStatus(function(response) {
//       console.log('getLoginStatus', response);
//       statusChangeCallback(response);
//     });

// };