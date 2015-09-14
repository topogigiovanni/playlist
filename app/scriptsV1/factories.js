app.factory('CurrentVideo', function($sce) {

    var factory = {}; 
    factory.instance = {
      addEventListener: function(){}
    };
    factory.setVideo = function(data){
        var video = {};
        angular.extend(factory, data);
        factory.iframeSrc = $sce.trustAsResourceUrl(data.iframeSrc);
        // if(data.origin == 'youtube'){
        //   video = new YT.Player('player1', {
        //     events: {
        //       'onStateChange': onPlayerStateChange
        //     }
        //   });
        // }
        console.log('setVideo',data);
        //console.log('video getApiInterface', data.instance.B.videoData.title);

        
    };
    var onPlayerReady = function(a,b,c,d){
      console.log('play ready', a,b,c,d);
    }
    var onPlayerStateChange = function(e){
      console.log('play onPlayerStateChange', e);
      if(e.data === 0){
        // mudar para próximo vídeo
      }
    }
    //factory.iframeSrc = 'asdasdsa2';
    return factory;
});

app.factory('YoutubeCommand', function(CurrentVideo) {
    var PLAYER = "player1";
    var factory = {}; 
    factory.play= function(){
      //Player.Youtube.call(PLAYER, 'playVideo');
      CurrentVideo.instance.playVideo();
    };
    factory.pause= function(){
      //Player.Youtube.call(PLAYER, 'pauseVideo');
      CurrentVideo.instance.pauseVideo();
    };
    factory.stop= function(){
      //Player.Youtube.call(PLAYER, 'stopVideo');
      CurrentVideo.instance.stopVideo();
    };
    return factory;
});

app.factory('VimeoCommand', function() {
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

    var factory = {}; 
    factory.play= function(){
      player.api('play');
    };
    factory.pause= function(){
      player.api('pause');
    };
    return factory;
});

app.factory('Player', function($rootScope, CurrentVideo, YoutubeCommand, VimeoCommand) {
    var factory = {}; 
    var _factories = {
      vimeo: VimeoCommand,
      youtube: YoutubeCommand
    }
    factory.isPlaying = true;
    factory.next = function(){
      var currentIndex = _.findIndex(videoList, {ID:CurrentVideo.ID});
      var nextIndex = currentIndex + 1;
      console.log('next ', currentIndex, nextIndex, videoList[nextIndex]);
      if(videoList[nextIndex]){
        CurrentVideo.setVideo(videoList[nextIndex]);
      }
    };
    factory.prev = function(){
      var currentIndex = _.findIndex(videoList, {ID:CurrentVideo.ID});
      var prevIndex = currentIndex - 1;
      console.log('prev ', currentIndex, prevIndex, videoList[prevIndex]);
      if(videoList[prevIndex]){
        CurrentVideo.setVideo(videoList[prevIndex]);
      }
    };
    factory.play = function(notChangePlayer){
      var currentIndex = _.findIndex(videoList, {ID:CurrentVideo.ID});
      if(factory.isPlaying){
        if(!notChangePlayer)
          factory.isPlaying = false;
        $rootScope.$broadcast('Player.Pause', {isPlaying: factory.isPlaying});
        console.log('play() pause CurrentVideo', CurrentVideo, '_factories', _factories);
        _factories[CurrentVideo.origin].pause();
      }else{
        if(!notChangePlayer)
          factory.isPlaying = true;
        $rootScope.$broadcast('Player.Play', {isPlaying: factory.isPlaying});
        console.log('play() play CurrentVideo', CurrentVideo, '_factories', _factories);
        _factories[CurrentVideo.origin].play();
      }
      CurrentVideo.instance.addEventListener('onStateChange', function(a,b,c){
        console.log('fakee listenrr 333', a,b,c);
      });
      console.log('index of CurrentVideo', currentIndex);
      
    };
    factory.changeToPlay = function(){
        this.isPlaying = true;
    };
    factory.changeToPause = function(){
        this.isPlaying = false;
    };
    console.log('CurrentVideo', CurrentVideo);
    $body.on('PlayerStatePlay', function(){
      factory.isPlaying = true;
      //factory.changeToPause();
      //factory.play();
      $rootScope.$broadcast('Player.Play',{isPlaying: factory.isPlaying});
    });
    $body.on('PlayerStatePause', function(){
      factory.isPlaying = false;
      //factory.changeToPause();
      //factory.play();
      $rootScope.$broadcast('Player.Pause', {isPlaying: factory.isPlaying});
    });
    return factory;
});