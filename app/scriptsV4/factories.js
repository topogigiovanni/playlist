app.factory('CurrentVideo', function($rootScope, $sce) {

    var factory = {}; 
    factory.instance = {
      addEventListener: function(){}
    };
    factory.setVideo = function(data, apply){
        var video = {};
        angular.extend(factory, data);
        factory.iframeSrc = $sce.trustAsResourceUrl(data.iframeSrc);
        if(data.origin == 'youtube'){
        //   video = new YT.Player('player1', {
        //     events: {
        //       'onStateChange': onPlayerStateChange
        //     }
        //   });
          factory.instance = Player.Youtube.newInstance();
        }

        // factory.instance = new YT.Player('player1', {
        //   videoId: data.id,
        //   events: {
        //     'onStateChange': Player.Youtube.OnPlayerStateChange
        //   }
        // });
        
        //factory.instance.addEventListener('onStateChange', Player.Youtube.OnPlayerStateChange);
        console.log('setVideo',data);
        if(apply)
          $rootScope.$apply();
        //console.log('video getApiInterface', data.instance.B.videoData.title);

    };

    // remover
    var onPlayerReady = function(a,b,c,d){
      console.log('play ready', a,b,c,d);
    }
    // remover
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
    var _isPlaying = false;

    // When the player is ready, add listeners for pause, finish, and playProgress
    player.addEvent('ready', function() {
      player.addEvent('pause', onPause);
      player.addEvent('finish', onFinish);
      player.addEvent('playProgress', onPlayProgress);
    });

    // Call the API when a button is pressed
    // $('button').bind('click', function() {
    //   player.api($(this).text().toLowerCase());
    // });

    function onPause(id) {
      console.log('paused');
      _isPlaying = false;
      $body.trigger('PlayerStatePause');
    }

    function onFinish(id) {
      _isPlaying = false;
      console.log('vimeo finish', id);
      status.text('finished');
      $body.trigger('PlayerStateChangeNext');
    }

    function onPlayProgress(data, id) {
      //console.log(data.seconds + 's played');
      if(!_isPlaying){
        _isPlaying = true;
        $body.trigger('PlayerStatePlay');
      }
    }

    var factory = {}; 
    factory.stop = function(){
      player.api('stop');
    };
    factory.play = function(){
      player.api('play');
    };
    factory.pause = function(){
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
    factory.next = function(apply){
      var currentIndex = _.findIndex(videoList, {ID:CurrentVideo.ID});
      var nextIndex = currentIndex + 1;
      console.log('next ', currentIndex, nextIndex, videoList[nextIndex], 'CurrentVideo', CurrentVideo, 'videoList',videoList);
      if(videoList[nextIndex]){
        CurrentVideo.setVideo(videoList[nextIndex], apply);
      }
    };
    factory.prev = function(apply){
      var currentIndex = _.findIndex(videoList, {ID:CurrentVideo.ID});
      var prevIndex = currentIndex - 1;
      console.log('prev ', currentIndex, prevIndex, videoList[prevIndex]);
      if(videoList[prevIndex]){
        CurrentVideo.setVideo(videoList[prevIndex], apply);
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
      //console.log('index of CurrentVideo', currentIndex);
      
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
      $rootScope.$broadcast('Player.Play',{isPlaying: factory.isPlaying, apply:true});
    });
    $body.on('PlayerStatePause', function(){
      factory.isPlaying = false;
      //factory.changeToPause();
      //factory.play();
      $rootScope.$broadcast('Player.Pause', {isPlaying: factory.isPlaying, apply:true});
    });
    $body.on('PlayerStateChangeNext', function(){
      factory.next(true);
    });
    return factory;
});