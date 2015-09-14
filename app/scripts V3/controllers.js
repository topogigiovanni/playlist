'use strict';

app.controller('MainController', ['$scope','$rootScope','CurrentVideo', function ($scope, $rootScope, CurrentVideo) {
  console.log('CurrentVideo', CurrentVideo);
  $scope.currentVideo = CurrentVideo;
  $rootScope.$on('Main.ChangeCurrentVideo', function(ev, data){
    console.log('escotou Main.ChangeCurrentVideo', ev, data);
    $scope.currentVideo = data;
  });
}]);

app.controller('VideoListController', ['$scope',function ($scope) {
  $scope.videoList = videoList;
}]);

app.controller('VideoUploaderController', ['$scope', '$rootScope', 'CurrentVideo', function ($scope, $rootScope, CurrentVideo, $sce) {
  $scope.url = "https://www.youtube.com/watch?v=mEfJu-zU9WY";
  // coloca na fila
  $scope.send = function(){
    if(!$scope.url){
      // erro
      return;
    }
    var url = $scope.url;
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
    
    //angular.extend(currentVideo, videoList[videoList.length - 1] );
    //currentVideo.iframeSrc = $sce.trustAsResourceUrl(currentVideo.iframeSrc);
    //currentVideo.iframeSrc = $sce.getTrustedResourceUrl(currentVideo.iframeSrc);

    //currentVideo = videoList[videoList.length - 1];
    //$rootScope.$broadcast('Main.ChangeCurrentVideo', videoList[videoList.length - 1]);
  };
  //console.log('videoList',  $scope.videoList);

}]);

app.controller('VideoPlayerController', ['$scope', '$rootScope', 'Player', 'CurrentVideo', function ($scope, $rootScope, Player, CurrentVideo) {
  
 // angular.extend($scope, Player);
  $scope.Player = Player;
  $scope.isPlaying  = true;

  $rootScope.$on('Player.Pause', function(ev, data){
    console.log('escotou Player.Pause', ev, data, Player);
    

    //$scope.isPlaying = data.isPlaying;
    //angular.extend($scope, Player);
   // angular.extend($scope, {isPlaying: Player.isPlaying});
    //angular.extend($scope, {isPlaying: false});
    //$scope.Player.isPlaying = data.isPlaying;
    angular.extend($scope.Player, data);
    if(data.hasOwnProperty('apply') && data.apply)
      $scope.$apply();

  });
  $rootScope.$on('Player.Play', function(ev, data){
    console.log('escotou Player.Play', ev, data, Player);
    //$scope.isPlaying = data.isPlaying;
    //angular.extend($scope, Player);
    //angular.extend($scope, {isPlaying: true});
    //angular.extend($scope, {isPlaying: Player.isPlaying});

    //$scope.Player.isPlaying = data.isPlaying;
    angular.extend($scope.Player, data);
    if(data.hasOwnProperty('apply') && data.apply)
      $scope.$apply();

  });

}]);


