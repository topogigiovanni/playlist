'use strict';

/**
 * @ngdoc service
 * @name playlistApp.Search
 * @description
 * # Search
 * Factory in the playlistApp.
 */
app.factory('VimeoSearch', function($rootScope, $http) {
  var factory = {};
  factory.doSearch = function(term, callback){
    if(factory.correntRequest && factory.correntRequest.readyState != 4 && factory.correntRequest.readyState != 2){
      factory.correntRequest.abort();
    };
    var _callback = function(items, success){
      console.log('vimeo search callback', items);
      var list = [];
      if(items.data.length){
        items.data.forEach(function(el, index){
          var id = el.uri.replace('/videos/','');
          var title = el.name;
          var thumb = _.where(el.pictures.sizes, {width:200});
          //console.log('vimeooo search thumb', thumb);
          if(!thumb.length){
            thumb = el.picture.sizes[0].link;
          }else
            thumb = thumb[0].link;
            var url = 'https://vimeo.com/'+id;
          list.push(new SearchResultItem(id, 'vimeo', title, thumb, url));
        });
      }
      callback(list, success);
    };
    factory.correntRequest = $.getJSON('https://api.vimeo.com/videos?query='+term+'&sort=relevant&videoEmbeddable=true&part=snippet,contentDetails&access_token='+KEYS['vimeo'], _callback);
  };
  factory.correntRequest = null;
  return factory;
});

app.factory('YoutubeSearch', function($rootScope, $http) {
  var factory = {};
  factory.doSearch = function(term, callback){
    console.log('doRequest Request!!!',factory.correntRequest);
    if(factory.correntRequest && factory.correntRequest.readyState != 4 && factory.correntRequest.readyState != 2){
      factory.correntRequest.abort();
    };
    var _callback = function(items, success){
      console.log('youtube search callback', items);
      var list = [];
      if(items.items.length){
        items.items.forEach(function(el, index){
          var id = el.id.videoId;
          var title = el.snippet.title;
          var thumb = el.snippet.thumbnails.default.url;
          var url = 'https://www.youtube.com/watch?v='+id;
          list.push(new SearchResultItem(id, 'youtube', title, thumb, url));
        });
      }
      callback(list, success);
    };

    factory.correntRequest = $.getJSON('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=20&q='+term+'&key='+KEYS['youtube'], _callback);
  };
  factory.correntRequest = null;
  return factory;
});

app.factory('Search', function($rootScope, $http, YoutubeSearch, VimeoSearch) {
    var factory = {};
    var termCached = '';
    var bulkResultItems = function(items, isSuccess){
      //console.log('bulkResultItems', items, isSuccess);
      // receber items formatados
      //factory.resultItems = items;
      factory.resultItems = _.union(factory.resultItems, items);
      $rootScope.$broadcast('Search.ResultItems.Changed', {resultItems: factory.resultItems});
      //$rootScope.$apply();
    };
    var doSearch = function(term){
      console.log('Search doSearch', term);
      if(!term){
        factory.modal.close();
        return;
      };
      if(term.length > 2 && termCached != term){
        termCached = term;
        factory.resultItems = [];
        YoutubeSearch.doSearch(term, bulkResultItems);
        VimeoSearch.doSearch(term, bulkResultItems);        
      };
      return;
    };
    var addToVideoList = function(url){
      console.log(' addToVideoList url', url);
      // V1
      // var cb = function(r){
      //   console.log('cb addToVideoList', video, r);
      //   if(video.isValid)
      //     $scope.$broadcast('Search.AddToVideoList', {video:video});
      // }

      // var video = new Video(url, cb);

      $rootScope.$broadcast('Search.AddToVideoList', {url:url});
    };
    //factory.doSearch =  _.throttle(doSearch, 5);
    factory.doSearch = doSearch;
    factory.addToVideoList = addToVideoList;
    factory.resultItems = [];
    factory.modal = {};
    factory.modal.open = function(){
      $searchModal.modal('show');
      $searchModal.find('input').focus();
    };
    factory.modal.close = function(){
      $searchModal.modal('hide');
      $('#search').find('input').focus();
    };
    return factory;
});
