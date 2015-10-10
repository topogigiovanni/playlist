'use strict';

/**
 * @ngdoc function
 * @name playlistApp.controller:VideolistCtrl
 * @description
 * # VideolistCtrl
 * Controller of the playlistApp
 */
app.controller('VideoListCtrl', ['$scope','$rootScope', function ($scope, $rootScope) {
  $scope.clearVideoList = function(){
    $scope.videoList.length = 0;
    //$scope.currentVideo = {};
    angular.copy(null, $scope.videoList);

    var msg = new BroadcastMessage('remove'
                                    ,{
                                     videoList: $scope.videoList,
                                     itemRemoved: 0,
                                     isCurrent: true
                                   });
    $rootScope.$broadcast('VideoList.Changed', msg);
    
  };
  $scope.videoListDuration = function(){
    var durationSeconds = 0;
    //if($scope.videoList && $scope.videoList.length){
      $scope.videoList.forEach(function(el){
        //console.log('vidoelist forach',el);
        durationSeconds += el.duration.seconds;
      });
   // };
    return helper.Date.secondsToStringFormatted(durationSeconds);
  };

  $scope.dragControlListeners = {
    // accept: function (sourceItemHandleScope, destSortableScope) {return true }, //override to determine drag is allowed or not. default is true.
    // itemMoved: function (e) { console.log('itemMoved',e); },
    // orderChanged: function(e) { console.log('orderChanged',e); },
    containment: '#playlist', //optional param.
    clone: false //optional param for clone feature.
  };

}]);