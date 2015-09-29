'use strict';

/**
 * @ngdoc service
 * @name playlistApp.User
 * @description
 * # User
 * Service in the playlistApp.
 */

app.service('FacebookUser', function ($rootScope) {
	var self = this;
	// autoload
	self.init = function() {
		window.fbAsyncInit = function() {
			FB.init({
				appId: '1500768470237803',
				cookie: true, // enable cookies to allow the server to access 
				// the session
				xfbml: true, // parse social plugins on this page
				version: 'v2.4',
				oauth: true
			});
			console.log('fbAsyncInit', FB);

			// Now that we've initialized the JavaScript SDK, we call 
			// FB.getLoginStatus().  This function gets the state of the
			// person visiting this page and can return one of three states to
			// the callback you provide.  They can be:
			//
			// 1. Logged into your app ('connected')
			// 2. Logged into Facebook, but not your app ('not_authorized')
			// 3. Not logged into Facebook and can't tell if they are logged into
			//    your app or not.
			//
			// These three cases are handled in the callback function.

			FB.getLoginStatus(function(response) {
				console.log('getLoginStatus', response);
				// The response object is returned with a status field that lets the
				// app know the current login status of the person.
				// Full docs on the response object can be found in the documentation
				// for FB.getLoginStatus().
				if (response.status === 'connected') {
					// Logged into your app and Facebook.
					_getAPIData();
					return;
				} else if (response.status === 'not_authorized') {
					// The person is logged into Facebook, but not your app.
					document.getElementById('status').innerHTML = 'Please log ' +
						'into this app.';
				} else {
					// The person is not logged into Facebook, so we're not sure if
					// they are logged into this app or not.
					document.getElementById('status').innerHTML = 'Please log ' +
						'into Facebook.';
				}
				//$rootScope.$broadcast('User.Provider.Ready', response);
			});

		};

	};
	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	var _getAPIData = function() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me?fields=email,name', function(response) {
			console.log('response', response);
			document.getElementById('status').innerHTML =
				'Thanks for logging in, ' + response.name + '!';
			$rootScope.$broadcast('User.Provider.Ready', response);
		});
	};
	self.init();

});

app.service('User', function ($rootScope, FacebookUser) {
	var self = this;
	// autoload
	var init = function() {
		console.log('User service initialized');
		FacebookUser.init();
	};
	init();

	var _syncData = function(data){
		$.ajax({
			url:'http://localhost:8000/createUser',
			data: data,
			type: 'POST'
		})
		.success(function(r){
			console.log('User _syncData success', r)
		})
		.error(function(e){
			console.error('User _syncData error',e);
		});
	};

	$rootScope.$on('User.Provider.Ready', function(e, args){
		console.log('Listen User.Provider.Ready', e, args);
		self.name = args.name;
		$rootScope.$apply();
		_syncData({email: self.email});
	});

	self.isLogged = false;
	self.name = 'Nome do usuário';
	return self;
});
