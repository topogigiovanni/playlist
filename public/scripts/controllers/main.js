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

  // scrollbar Config
  $scope.scrollbarConfig = {
    theme: 'dark-3',
    scrollInertia: 500
  };

  // Search
  $scope.searchTerm = '';
  $scope.inputSubmit = function(allowAddVideo){
    var term = $scope.searchTerm || angular.element('#mainInput').val();
    if(!term) return;
    if(helper.Url.isValid(term)){
      if(allowAddVideo)
        addToVideoList({url:term});
    }else{
      Search.doSearch(term);
      Search.modal.open();
    }

    // OLD
    // faz busca direto no elemento devido a ações da extenção do chrome
    //Search.doSearch($scope.searchTerm || angular.element('#search-input').val());
  };
  $scope.closeSearchModal = function(){
      Search.modal.close();
  };

  // VideoUploader
  var addToVideoList = function(data){
    var url = (data && data.url) ? data.url : '';
    console.debug('addToVideoList', url);
    // if(!url)
    //   url = $scope.url = angular.element('#newVideo').val() || null;
    if(!url){
      // TODO apresenta erro na UI
      return;
    };
    var callback = function(r){
      console.log('on callback', r, video);
      if(video.isValid){
        // atualiza vídeo
        video = video;
        videoList = videoList || [];
        console.log('indexxx', _.findIndex(videoList, {id: video.id}));
        // procura pela existência de outro vídeo de mesmo ID
        if(_.findIndex(videoList, {id: video.id}) !== -1){
          // zera valor do input
          $scope.searchTerm = "";
          $scope.$apply();
          // apresenta erro de video já inserido na UI
          alert('este vídeo já está na lista'); 
          return;
        }
        videoList.push(video);
        $scope.videoList = videoList;
        // zera valor do input
        $scope.searchTerm = "";  
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

  // currentPlaylist
  $scope.currentPlaylist = currentPlaylist;
  // videoList
  $scope.videoList = videoList;
  
  $scope.removeFromList = function(i){
  	var isCurrent = $scope.currentVideo.id == $scope.videoList[i].id;
  	console.log('removeFromList', i ,$scope.videoList, isCurrent);
  	$scope.videoList.splice(i, 1);
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