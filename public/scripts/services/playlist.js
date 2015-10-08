'use strict';

/**
 * @ngdoc service
 * @name playlistApp.Playlist
 * @description
 * # Playlist
 * Service in the playlistApp.
 */

app.service('Playlist', function ($rootScope) {
	var self = this;
	var resource = $resource('/api/playlists/:id/:controller', {
						id: '@_id'
					}, {
						get: {
							method: 'GET',
							params: {
								id: 'me'
							}
						}
					});
});
