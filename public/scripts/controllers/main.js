'use strict';

/**
 * @ngdoc function
 * @name playlistApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the playlistApp
 */
app.controller('MainCtrl', ['$scope','$rootScope', '$translate', '$cookies', 'CurrentVideo', 'Search', 'User', function ($scope, $rootScope, $translate, $cookies, CurrentVideo, Search, User) {
  
  // CurrentVideo
  console.log('CurrentVideo', CurrentVideo);
  $scope.currentVideo = CurrentVideo;

  $scope.scrollbarConfig = {
    theme: 'dark-3',
    scrollInertia: 500
  };

  // Search
  $scope.searchTerm = '';
  $scope.requestSearch = function(){
    // faz busca direto no elemento devido a ações da extenção do chrome
    Search.doSearch($scope.searchTerm || angular.element('#search-input').val());
  };
  $scope.fakeSearchKeyUp = function(){
    var term = $scope.searchTerm;
    if(!term)
      term = angular.element('#search-input').val() || null;
    if(term)
      Search.modal.open();
  };
  $scope.closeSearchModal = function(){
      Search.modal.close();
  };

  $scope.currentPlaylist = currentPlaylist;
  // VideoList
  $scope.videoList = videoList;
  
  $scope.removeFromList = function(i){
  	var isCurrent = $scope.currentVideo.id == $scope.videoList[i].id;
  	console.log('removeFromList', i ,$scope.videoList, isCurrent);
  	$scope.videoList.splice(i, 1);
  	// var msg = {
  	// 	type: 'removed',
  	// 	data: {
  	// 		videoList: $scope.videoList,
  	// 		itemRemoved: i,
  	// 		isCurrent: isCurrent
  	// 	}
  	// };
    var msg = new BroadcastMessage('remove'
                                    ,{
                                     videoList: $scope.videoList,
                                     itemRemoved: i,
                                     isCurrent: isCurrent
                                   });
  	$rootScope.$broadcast('VideoList.Changed', msg);
  };
  $rootScope.$on('VideoList.Changed', function(ev, m){
    if(m.type == "change"){
      $scope.videoList = m.data.videoList;
    }
  });
  $scope.User = User;

  $scope.currentLang = $translate.use();
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 20);
  $scope.changeLanguage = function (lang) {
    $translate.use(lang);
    $cookies.put('lang', lang, {expires: expireDate});
    $scope.currentLang = lang;
  };
  if($cookies.get('lang')){
    $scope.changeLanguage($cookies.get('lang'));
  };

}]);