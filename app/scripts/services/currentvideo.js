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
