'use strict';

/**
 * @ngdoc function
 * @name playlistApp.controller:VideoplayerCtrl
 * @description
 * # VideoplayerCtrl
 * Controller of the playlistApp
 */
app.controller('VideoPlayerCtrl', ['$scope', '$rootScope', 'Player', 'CurrentVideo', function ($scope, $rootScope, Player, CurrentVideo) {
  
 // angular.extend($scope, Player);
  $scope.Player = Player;
  $scope.isPlaying  = true;

  $rootScope.$on('Player.Pause', function(ev, data){
    console.log('escotou Player.Pause', ev, data, Player);
    angular.extend($scope.Player, data);
    if(data.hasOwnProperty('apply') && data.apply)
      $scope.$apply();

  });
  $rootScope.$on('Player.Play', function(ev, data){
    console.log('escotou Player.Play', ev, data, Player);
    angular.extend($scope.Player, data);
    if(data.hasOwnProperty('apply') && data.apply)
      $scope.$apply();

  });

  $rootScope.$on('Player.Stop', function(ev, data){
    console.log('escotou Player.Stop', ev, data, Player);
    $scope.Player.stop();
  });

}]);
