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

  $scope.dragControlListeners = {
    // accept: function (sourceItemHandleScope, destSortableScope) {return true }, //override to determine drag is allowed or not. default is true.
    // itemMoved: function (e) { console.log('itemMoved',e); },
    // orderChanged: function(e) { console.log('orderChanged',e); },
    containment: '#playlist', //optional param.
    clone: false //optional param for clone feature.
  };

}]);