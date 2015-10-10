'use strict';

/**
 * @ngdoc service
 * @name playlistApp.CurrentVideo
 * @description
 * # currentvideo
 * Factory in the playlistApp.
 */
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
      };

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
    function reSetVideo(data){
      console.log('reSetVideo', data);
      var videoList = data.videoList;
      var lastIndex = data.itemRemoved;
      if(!data.isCurrent)
        return;
      
      if(videoList[lastIndex]){
        factory.setVideo(videoList[lastIndex]);
        //console.debug('reSetVideo tem na mesma posição');
      }else if(videoList[lastIndex+1]){
        factory.setVideo(videoList[lastIndex+1]);
        //console.debug('reSetVideo tem proximo');
      }else if(videoList[lastIndex-1]){
        factory.setVideo(videoList[lastIndex-1]);
        //console.debug('reSetVideo tem proximo');
      }else{
        $rootScope.$broadcast('Player.Stop', {});
        //console.debug('reSetVideo não tem mais item', factory);
      }

    };
    $rootScope.$on('VideoList.Changed', function(ev, data){
      console.log('on VideoList.Changed', data);
      // switch(data.type){
      //   case 'remove':
      //     reSetVideo(data.data);
      //     break;
      //   case 'removeAll':
      //     reSetVideo(data.data);
      //     break;
      // }
      if(data.type == 'remove'){
        reSetVideo(data.data);
      }
    });
    return factory;
});
