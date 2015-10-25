'use strict';

// NÂO USADO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 * @ngdoc function
 * @name playlistApp.controller:VideouploaderCtrl
 * @description
 * # VideouploaderCtrl
 * Controller of the playlistApp
 */
app.controller('VideoUploaderCtrl', ['$scope', '$rootScope', 'CurrentVideo', function ($scope, $rootScope, CurrentVideo, $sce) {
  //$scope.url = "https://www.youtube.com/watch?t=3&v=Jdx0rq8j3sY";
  $scope.url = "";
  // coloca na playlist
  $scope.send = function(){
    console.debug('send()', $scope.url);
    var url = $scope.url;
    if(!url)
      url = $scope.url = angular.element('#mainInput').val() || null;
    if(!url){
      // TODO apresenta erro na UI
      return;
    };
    // var url = $scope.url;
    //url = helper.Url.removeProtocol(url);
    // var video = new Video(url, callback);
    // dispara loader
    var callback = function(r){
      console.log('on callback', r, video);
      if(video.isValid){
        //video.title = r.items[0].snippet.title;
        video = video;
        videoList = videoList || [];
        videoList.push(video);
        $scope.videoList = videoList;
        // zera valor do input
        $scope.url = "";  
        // verifica se é o único da lista
        if(videoList.length == 1){ 
          CurrentVideo.setVideo(video);
        }
        $scope.$apply();
      }else{
        // apresenta erro de video invalido na UI
        alert('url inválida');
      }
    };
    
    var video = new Video(url, callback);
  };

  //console.log('videoList',  $scope.videoList);
  var addToVideoList = function(data){
    $scope.url = (data && data.url) ? data.url : '';
    $scope.send();
    // TODO apresentar msg de sucesso na UI
  };
  $rootScope.$on('Search.AddToVideoList', function(ev, data){
    console.log('on Search.AddToVideoList', data);
    addToVideoList(data);
  });

  $body.on('AddToVideoList', function(e, data){
    console.log('$body.on', e, data);
    addToVideoList(data);
  });

}]);