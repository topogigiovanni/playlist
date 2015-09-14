app.controller('MainController', ['$scope','$rootScope','CurrentVideo', 'Search', function ($scope, $rootScope, CurrentVideo, Search) {
  console.log('CurrentVideo', CurrentVideo);
  $scope.currentVideo = CurrentVideo;
  $rootScope.$on('Main.ChangeCurrentVideo', function(ev, data){
    console.log('escotou Main.ChangeCurrentVideo', ev, data);
    $scope.currentVideo = data;
  });

  $scope.scrollbarConfig = {
    theme: 'dark-3',
    scrollInertia: 500
  };

  $scope.searchTerm = '';
  $scope.requestSearch = function(){
    Search.doSearch($scope.searchTerm);
  };
  $scope.fakeSearchKeyUp = function(){
    if($scope.searchTerm)
      Search.modal.open();
  };
}]);

app.controller('VideoListController', ['$scope',function ($scope) {
  $scope.videoList = videoList;
  $scope.videoListDuration = function(){
    var durationSeconds = 0;
    $scope.videoList.forEach(function(el){
      //console.log('vidoelist forach',el);
      durationSeconds += el.duration.seconds;
    });
    return helper.Date.secondsToStringFormatted(durationSeconds);
  };

}]);

app.controller('VideoUploaderController', ['$scope', '$rootScope', 'CurrentVideo', function ($scope, $rootScope, CurrentVideo, $sce) {
  // TODO zerar variável
  $scope.url = "https://www.youtube.com/watch?v=mEfJu-zU9WY";
  // coloca na playlist
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

  $scope.$on('Search.AddToVideoList', function(ev, data){
    console.log('on Search.AddToVideoList',data);
    // V1
    // $scope.videoList.push(data.video);
    // $scope.$apply();
    $scope.url = data.url;
    $scope.send();

    // apresentar msg de sucesso na UI
  });

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

app.controller('SearchController', ['$scope', '$rootScope', 'Search', '$timeout', function ($scope, $rootScope, Search, $timeout) {
  $scope.resultItems = Search.resultItems;
  $rootScope.$on('Search.ResultItems.Changed', function(e, data){
    //console.debug('on Search.ResultItems.Changed',e, data);
    //$scope.resultItems = data.resultItems;

    // problema no apply bindings no keyup
    // http://stackoverflow.com/questions/21033635/is-it-possible-to-update-the-model-after-keypress-but-before-keyup
    $timeout(function(){
      $scope.resultItems = data.resultItems;
    });
  });
  $scope.addToVideoList = Search.addToVideoList;
}]);

