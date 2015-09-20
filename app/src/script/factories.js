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
          //factory.instance = Player.Youtube.newInstance(data.id);
         
          Player.Youtube.instance = Player.Youtube.newInstance(data.id);
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

        $playlist.mCustomScrollbar('scrollTo','.vid-'+factory.id);
        //$rootScope.$broadcast('CurrentVideo.Changed', {data: factory});
    
    };
    return factory;
});

app.factory('YoutubeCommand', function(CurrentVideo) {
    var factory = {}; 
    factory.play = function(){
      Player.Youtube.call(PLAYER, 'playVideo');
      //CurrentVideo.instance.playVideo();
    };
    factory.pause = function(){
      Player.Youtube.call(PLAYER, 'pauseVideo');
      //CurrentVideo.instance.pauseVideo();
    };
    factory.stop = function(){
      Player.Youtube.call(PLAYER, 'stopVideo');
      //CurrentVideo.instance.stopVideo();
    };
    return factory;
});

app.factory('VimeoCommand', function() {
    var iframe = $('#'+PLAYER)[0];
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
    };
    factory.isPlaying = false;
    factory.next = function(apply){
      var currentIndex = _.findIndex(videoList, {id:CurrentVideo.id});
      var nextIndex = currentIndex + 1;
      console.log('next ', currentIndex, nextIndex, videoList[nextIndex], 'CurrentVideo', CurrentVideo, 'videoList',videoList);
      if(videoList[nextIndex]){
        CurrentVideo.setVideo(videoList[nextIndex], apply);
      }
    };
    factory.prev = function(apply){
      var currentIndex = _.findIndex(videoList, {id:CurrentVideo.id});
      var prevIndex = currentIndex - 1;
      console.log('prev ', currentIndex, prevIndex, videoList[prevIndex]);
      if(videoList[prevIndex]){
        CurrentVideo.setVideo(videoList[prevIndex], apply);
      }
    };
    factory.play = function(notChangePlayer){
      var currentIndex = _.findIndex(videoList, {id:CurrentVideo.id});
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
    // remover
    // factory.changeToPlay = function(){
    //     this.isPlaying = true;
    // };
    // factory.changeToPause = function(){
    //     this.isPlaying = false;
    // };
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

app.factory('VimeoSearch', function($rootScope, $http) {
  var factory = {};
  factory.doSearch = function(term, callback){
    if(factory.correntRequest && factory.correntRequest.readyState != 4 && factory.correntRequest.readyState != 2){
      factory.correntRequest.abort();
    };
    var _callback = function(items, success){
      console.log('vimeo search callback', items);
      var list = [];
      if(items.data.length){
        items.data.forEach(function(el, index){
          var id = el.uri.replace('/videos/','');
          var title = el.name;
          var thumb = _.where(el.pictures.sizes, {width:200});
          //console.log('vimeooo search thumb', thumb);
          if(!thumb.length){
            thumb = el.picture.sizes[0].link;
          }else
            thumb = thumb[0].link;
            var url = 'https://vimeo.com/'+id;
          list.push(new SearchResultItem(id, 'vimeo', title, thumb, url));
        });
      }
      callback(list, success);
    };
    factory.correntRequest = $.getJSON('https://api.vimeo.com/videos?query='+term+'&sort=relevant&videoEmbeddable=true&part=snippet,contentDetails&access_token='+KEYS['vimeo'], _callback);
  };
  factory.correntRequest = null;
  return factory;
});

app.factory('YoutubeSearch', function($rootScope, $http) {
  var factory = {};
  factory.doSearch = function(term, callback){
    console.log('doRequest Request!!!',factory.correntRequest);
    if(factory.correntRequest && factory.correntRequest.readyState != 4 && factory.correntRequest.readyState != 2){
      factory.correntRequest.abort();
    };
    var _callback = function(items, success){
      console.log('youtube search callback', items);
      var list = [];
      if(items.items.length){
        items.items.forEach(function(el, index){
          var id = el.id.videoId;
          var title = el.snippet.title;
          var thumb = el.snippet.thumbnails.default.url;
          var url = 'https://www.youtube.com/watch?v='+id;
          list.push(new SearchResultItem(id, 'youtube', title, thumb, url));
        });
      }
      callback(list, success);
    };

    factory.correntRequest = $.getJSON('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=20&q='+term+'&key='+KEYS['youtube'], _callback);
  };
  factory.correntRequest = null;
  return factory;
});

app.factory('Search', function($rootScope, $http, YoutubeSearch, VimeoSearch) {
    var factory = {};
    var termCached = '';
    var bulkResultItems = function(items, isSuccess){
      //console.log('bulkResultItems', items, isSuccess);
      // receber items formatados
      //factory.resultItems = items;
      factory.resultItems = _.union(factory.resultItems, items);
      $rootScope.$broadcast('Search.ResultItems.Changed', {resultItems: factory.resultItems});
      //$rootScope.$apply();
    };
    var doSearch = function(term){
      console.log('Search doSearch', term);
      if(!term){
        factory.modal.close();
        return;
      };
      if(term.length > 2 && termCached != term){
        termCached = term;
        factory.resultItems = [];
        YoutubeSearch.doSearch(term, bulkResultItems);
        VimeoSearch.doSearch(term, bulkResultItems);        
      };
      return;
    };
    var addToVideoList = function(url){
      console.log(' addToVideoList url', url);
      // V1
      // var cb = function(r){
      //   console.log('cb addToVideoList', video, r);
      //   if(video.isValid)
      //     $scope.$broadcast('Search.AddToVideoList', {video:video});
      // }

      // var video = new Video(url, cb);

      $rootScope.$broadcast('Search.AddToVideoList', {url:url});
    };
    //factory.doSearch =  _.throttle(doSearch, 5);
    factory.doSearch = doSearch;
    factory.addToVideoList = addToVideoList;
    factory.resultItems = [];
    factory.modal = {};
    factory.modal.open = function(){
      $searchModal.modal('show');
      $searchModal.find('input').focus();
    };
    factory.modal.close = function(){
      $searchModal.modal('hide');
      $('#search').find('input').focus();
    };
    return factory;
});