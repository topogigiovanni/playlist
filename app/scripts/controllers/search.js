'use strict';

/**
 * @ngdoc function
 * @name playlistApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the playlistApp
 */
app.controller('SearchCtrl', ['$scope', '$rootScope', 'Search', '$timeout',  function ($scope, $rootScope, Search, $timeout) {
  $scope.resultItems = Search.resultItems;
  $rootScope.$on('Search.ResultItems.Changed', function(e, data){
    /* 
       problema no apply bindings no keyup
       http://stackoverflow.com/questions/21033635/is-it-possible-to-update-the-model-after-keypress-but-before-keyup
    */
    $timeout(function(){
      $scope.resultItems = data.resultItems;
    });
  });
  $scope.addToVideoList = Search.addToVideoList;

  $scope.imgLoadedEvents = {

    always: function(instance) {
      // Do stuff
    },

    done: function(instance) {
      //console.log('imagesLoaded', instance);
      angular.element(instance.elements[0]).removeClass('hide');
    },

    fail: function(instance) {
      // Do stuff
    }

  };

}]);
