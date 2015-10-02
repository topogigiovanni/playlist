'use strict';

/**
 * @ngdoc function
 * @name playlistApp.controller:BrowsingUserCtrl
 * @description
 * # BrowsingUserCtrl
 * Controller of the playlistApp
 */

app.controller('BrowsingUserCtrl', function ($scope, $http, Modal) {
    $scope.openLoginModal = function(){
		Modal.openExtended(
			{
				templateUrl:'scripts/components/user/modal.login.html',
				controller: 'BrowsingUserCtrl'
			}
		);
    };
});
