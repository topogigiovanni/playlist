'use strict';

/**
 * @ngdoc function
 * @name playlistApp.controller:VideolistCtrl
 * @description
 * # VideolistCtrl
 * Controller of the playlistApp
 */

app.controller('VideoListCtrl', ['$scope',function ($scope) {
  
  $scope.videoListDuration = function(){
    var durationSeconds = 0;
    $scope.videoList.forEach(function(el){
      //console.log('vidoelist forach',el);
      durationSeconds += el.duration.seconds;
    });
    return helper.Date.secondsToStringFormatted(durationSeconds);
  };

}]);