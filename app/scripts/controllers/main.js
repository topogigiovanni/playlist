'use strict';

/**
 * @ngdoc function
 * @name playlistApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the playlistApp
 */
app.controller('MainCtrl', ['$scope','$rootScope','CurrentVideo', 'Search', function ($scope, $rootScope, CurrentVideo, Search) {
  console.log('CurrentVideo', CurrentVideo);
  $scope.currentVideo = CurrentVideo;
  // deprecated
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

  $scope.videoList = videoList;

}]);