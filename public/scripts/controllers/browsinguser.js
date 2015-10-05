'use strict';

/**
 * @ngdoc function
 * @name playlistApp.controller:BrowsingUserCtrl
 * @description
 * # BrowsingUserCtrl
 * Controller of the playlistApp
 */

app.controller('BrowsingUserCtrl', function ($scope, $http, Modal, User, UserModel) {
    var modal;
    var form;
    var callback = {
    	auth: {
    		success: function(d){
	    		console.log('callback auth success', d);
		    	if(modal)
		    		modal.close();
		    },
		    error: function(err){
		    	console.log('callback auth error', err);
		    	$scope.errors = {};
				// angular.forEach(err.errors, function(error, field) {
				// 	form[field].$setValidity('mongoose', false);
				// 	$scope.errors[field] = error.message;
				// });
				if(err.message)
					$scope.errors.other = err.message;
		    	else
		    		$scope.errors.other = 'Erro ao logar, tente novamente.';
		    }
    	},
    	authProvider: {
    		success: function(d){
	    		console.log('callback authProvider success', d, modal);
		    	if(modal)
		    		modal.close();
		    },
		    error: function(){}
    	},
	    register: {
	    	success: function(r){
	    		console.debug('callback register success', r, 'resolved', r.$resolved);
	    		if(r.$resolved){
	    			$scope.User.isLogged = true;
	    			angular.extend($scope.User, $scope.userRegister);
	    			if(modal)
		    			modal.close();
	    		}
	    	},
	    	error: function(err){
	    		console.log('callback register error', err,'form', form);
				$scope.errors = {};
				angular.forEach(err.errors, function(error, field) {
					form[field].$setValidity('mongoose', false);
					$scope.errors[field] = error.message;
				});
	    	}
	    },
	    registerProvider: {
    		success: function(d){
	    		console.log('callback authProvider success', d, modal);
		    	if(modal)
		    		modal.close();
		    },
		    error: function(){}
    	},
    };
    var openModal = function(templateUrl){
    	$scope.errors = {};
    	modal = Modal.openExtended(
			{
				templateUrl: templateUrl,
				//controller: 'BrowsingUserCtrl'
				scope: $scope
			}
		);	
    };
    $scope.errors = {};
    $scope.submitted  = {
    	register: false,
    	auth: false
    };
    $scope.userAuth = UserModel;
    $scope.userRegister = UserModel;

    $scope.openLoginModal = function(){
		openModal('scripts/components/user/user.modal.login.html');	
    };
    $scope.openRegisterModal = function(){
		openModal('scripts/components/user/user.modal.register.html');	
    };
    $scope.auth = function($f){
    	$scope.submitted.auth = true;
    	console.log('BrowsingUserCtrl auth', $scope.userAuth, $f);
		form = $f;
		console.debug('form valid?', form.$valid);
		if(form.$valid){
			User.auth($scope.userAuth, callback.auth.success, callback.auth.error);
		};
    };
    $scope.authProvider = function(providerName){
    	User.authProvider(providerName, callback.authProvider.success);
    };
    $scope.register = function($f){
    	$scope.submitted.register = true;
    	console.log('BrowsingUserCtrl register', $scope.userRegister, $f);
    	 form = $f;
    	 console.debug('form valid?', form.$valid);
    	 if(form.$valid){
    	 	User.register($scope.userRegister, callback.register.success, callback.register.error);
    	 };
    };
    $scope.registrerProvide = function(providerName){
    	User.registerProvider(providerName, callback.registerProvider.success);
    };

});
