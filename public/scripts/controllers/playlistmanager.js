'use strict';

/**
 * @ngdoc function
 * @name playlistApp.controller:PlaylistManagerCtrl
 * @description
 * # PlaylistManagerCtrl
 * Controller of the playlistApp
 */

app.controller('PlaylistManagerCtrl', function ($scope, CurrentVideo) {
    $scope.showCreateForm = false;
    $scope.toggleShowCreateForm = function(){
    	$scope.showCreateForm = !$scope.showCreateForm; 
    	if($scope.showCreateForm){
    		_.delay((function(){
    			$('.create-user input.title').focus();
    		}), 50); 
    	}
    };
    $scope.playlistTitle = "";
    $scope.save = function(form){
    	console.debug('save',$scope.playlistTitle,'form',form);
    	if($scope.showCreateForm){
    		// é novo registro
    		var playlist = new Playlist();
	    	playlist.title = $scope.playlistTitle || "Nova Playlist";
	    	playlist.videos = _.clone(videoList);
	    	console.log('Save playlist', playlist);
	    	$scope.playlistTitle  = "";
	    	$scope.User.playlists.push(playlist);
	    	$scope.showCreateForm = false;
	    	$scope.currentPlaylist = _.clone(playlist);

	    	// TODO salvar no banco

    	}else{
    		// é edição
    	};
    };
    
    $scope.setCurrentPlaylist = function(playlist){
    	console.log('setCurrentPlaylist',playlist);
    	angular.copy(playlist,$scope.currentPlaylist);
    	angular.copy(playlist.videos,$scope.videoList);
    	// troca video corrente pelo primeiro da lista
    	if(playlist.videos.length){
    		console.log('main',playlist.videos[0],'$scope.currentVideo',$scope.currentVideo);
    		CurrentVideo.setVideo(playlist.videos[0]);
    	};
    };
});
