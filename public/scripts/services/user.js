'use strict';

/**
 * @ngdoc service
 * @name playlistApp.User
 * @description
 * # User
 * Service in the playlistApp.
 */

app.service('UserModel', function () {	
	this._id = null;
	this.name = '';
	this.email = '';
	this.password = '';
	this.provider = '';
	this.providerId = '';
	this.avatar = '';
	this.playlists = [];
	this.__v = null;
});


// Google Provider
app.service('GoogleUser', function ($rootScope, UserModel) {
// doc: https://developers.google.com/identity/sign-in/web/build-button

	var self = this;
	var auth2;

	// autoload
	self.init = function(){
		//console.debug(' GoogleUser init');
		
		// var profile = googleUser.getBasicProfile();
		// console.log('GoogleUser ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
		// console.log('GoogleUser Name: ' + profile.getName());
		// console.log('GoogleUser Image URL: ' + profile.getImageUrl());
		// console.log('GoogleUser  Email: ' + profile.getEmail());
	

		gapi.load('auth2', function(a,b,c){
	      auth2 = gapi.auth2.init({
	        client_id: '1043350298053-kf1ognrkdu8fh4n0se7bfi43fu2kh9iq.apps.googleusercontent.com',
	        cookiepolicy: 'single_host_origin'
	      });
	      
	    });


	};
	// commented in 17-10-15
	//self.init();

	self.authenticate = function(callback){
		console.log('google service authenticate');
		//attachSignin($('.google_provider_button')[0]);
		
		auth2.signIn().then(
			function(obj){
				console.log('onn then', obj);
				var profile = obj.getBasicProfile();
				var msg = {};
				var response = _.extend(UserModel, {});
				response.name = profile.getName();
				response.email = profile.getEmail();
				response.provider = 'google';
				response.providerId = profile.getId();

				var msg = {
					isNew: false,
					data: response
				};
				$rootScope.$broadcast('User.Provider.Ready', msg);
				callback(response);
			}
		);

	};

	self.register = function(callback){
		console.log('google service authenticate');
		//attachSignin($('.google_provider_button')[0]);
		
		auth2.signIn().then(
			function(obj){
				console.log('onn then register', obj);
				var profile = obj.getBasicProfile();
				var msg = {};
				var response = _.extend(UserModel, {});
				response.name = profile.getName();
				response.email = profile.getEmail();
				response.provider = 'google';
				response.providerId = profile.getId();
				response.avatar = profile.getImageUrl() || '';
				var msg = {
					isNew: true,
					data: response
				};
				$rootScope.$broadcast('User.Provider.Ready', msg);
				callback(response);
			}
		);
	};

});

// Facebook Provider
app.service('FacebookUser', function ($rootScope, UserModel) {
	var self = this;
	var SCOPE = 'public_profile,email';
	//window.FB = window.FB || {};
	
	// autoload
	self.init = function(){
		var fbInit = function(){
			FB.init({
				appId: '1500768470237803',
				cookie: true, // enable cookies to allow the server to access 
				// the session
				xfbml: true, // parse social plugins on this page
				version: 'v2.4',
				oauth: true
			});
			$rootScope.$broadcast('User.Provider.Facebook.Ready', {});
		};
		if(window['FB'] && FB.init){
			fbInit();
		}else{
			window.fbAsyncInit = function() {
				fbInit();
			};
		};

		// window.fbAsyncInit = function() {
		// 	FB.init({
		// 		appId: '1500768470237803',
		// 		cookie: true, // enable cookies to allow the server to access 
		// 		// the session
		// 		xfbml: true, // parse social plugins on this page
		// 		version: 'v2.4',
		// 		oauth: true
		// 	});
		// 	// FB.init({
		// 	//      appId      : '1500768470237803',
		// 	//      xfbml      : true,
		// 	//      version    : 'v2.5'
		// 	//    });
		// 	$rootScope.$broadcast('User.Provider.Facebook.Ready', {});
		
		// };

		// FB.init({
		// 	appId: '1500768470237803',
		// 	cookie: true, // enable cookies to allow the server to access 
		// 	// the session
		// 	xfbml: true, // parse social plugins on this page
		// 	version: 'v2.4',
		// 	oauth: true
		// });
		// $rootScope.$broadcast('User.Provider.Facebook.Ready', {});
		

	};
	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	var _getAPIData = function(isNew) {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me?fields=email,name', function(response) {
			console.log('Facebook  _getAPIData response', response);
			response = _.extend(UserModel, response);
			response.provider = 'facebook';
			response.providerId = response.id;
			response.avatar = 'http://graph.facebook.com/v2.5/'+response.id+'/picture';
			var msg = {
				isNew: isNew,
				data: response
			};
			$rootScope.$broadcast('User.Provider.Ready', msg);
		});
	};
	// commented in 17-10-15
	//self.init();

	var _checkLoginSatus = function(callback){
		callback = callback || angular.noop;
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
			callback(response);
		});
	};

	self.register = function(callback){
		var cb = function(response){
			// The response object is returned with a status field that lets the
			// app know the current login status of the person.
			// Full docs on the response object can be found in the documentation
			// for FB.getLoginStatus().
			if (response.status === 'connected') {
				// Logged into your app and Facebook.
				_getAPIData(true);
			}
			//  else if (response.status === 'not_authorized') {
			// 	// The person is logged into Facebook, but not your app.
			// 	// document.getElementById('status').innerHTML = 'Please log ' +
			// 	// 	'into this app.';
			// } else {
			// 	// The person is not logged into Facebook, so we're not sure if
			// 	// they are logged into this app or not.
			// 	// document.getElementById('status').innerHTML = 'Please log ' +
			// 	// 	'into Facebook.';
			// }
			callback(response);
			return;
			
		};
		_checkLoginSatus(cb);
	};

	self.authenticate = function(callback){
		FB.login(function(response) {

	        if (response.authResponse) {
	            console.log('Welcome!  Fetching your information.... ');
	            
	            console.log(response); // dump complete info
	            _getAPIData(false);
	            
	          //   access_token = response.authResponse.accessToken; //get access token
	          //   user_id = response.authResponse.userID; //get FB UID

	          //   FB.api('/me', function(response) {
	          //       user_email = response.email; //get user email
	          // // you can store this data into your database             
	          //   });

	        } else {
	            //user hit cancel button
	            console.log('User cancelled login or did not fully authorize.');

	        }
	        callback(response);
	    }, {
	        scope: SCOPE,
	        return_scopes: true
	    });
	};

});

app.service('User', function ($rootScope, $http, $cookies, $resource, FacebookUser, GoogleUser, UserModel) {
	var self = this;
	var resource = $resource('/api/users/:id/:controller', {
						id: '@_id'
					}, {
						changePassword: {
							method: 'PUT',
							params: {
								controller: 'password'
							}
						},
						savePlaylist: {
							method: 'POST',
							params: {
								controller: 'playlist'
							}
						},
						deletePlaylist: {
							method: 'POST',
							params: {
								controller: 'deletePlaylist'
							}
						},
						get: {
							method: 'GET',
							params: {
								id: 'me'
							}
						}
					});
	var providers = [];
	providers['facebook'] = FacebookUser;
	providers['google'] = GoogleUser;

	// autoload
	var init = function() {
		console.log('User service initialized', $cookies.get('token'));
		providers['facebook'].init();
		providers['google'].init();
		var checkProviders = function(){
			// TODO implementar
			// $rootScope.$on('User.Provider.Facebook.Ready', function(){
			// 	console.log('on User.Provider.Facebook.Ready');
			// 	FacebookUser.checkLoginSatus();
			// });
		};
		if($cookies.get('token')){
			// get auth/local user data
			resource.get()
					.$promise
			        .then( function(r) {
			        	if(r && r._id){
							self.isLogged = true;
							angular.extend(self, r);
						}else{
							checkProviders();
						}
						console.log('on init resouce.get()', r, 'self', self, r._id);
						
			        })
			        .catch( function(err) {
			        	console.log('on init resouce.get() error', err);
			        	checkProviders();
					});
			
		}else{
			checkProviders();
		}
	};
	init();

	var setTokenCookie = function(token){
		console.log('setTokenCookie',token);
		var expireDate = new Date();
  		expireDate.setDate(expireDate.getDate() + 20);
		$cookies.put('token', token, {expires: expireDate});
		// TODO
		//helper.cookie.set('token', token, 20);
	};

	var setAuth = function(data){
		console.debug('setAuth', data);
		angular.extend(self, data);
		self._id = data._id;
		self.isLogged = true;
	};

	$rootScope.$on('User.Provider.Ready', function(e, args){
		console.log('Listen User.Provider.Ready', args);
		if(!args.data) return;
		var data = args.data;

		// // TODO ver se angular.extend nao substitui apply
		// $rootScope.$apply();

		//_syncData({email: self.email});
		console.debug('self',self);

		// se for novo registro
		if(args.isNew){
			//self.register = function(user, onThen, onCatch){
			resource.save({
	          name: data.name,
	          email: data.email,
	          password: data.providerId,
	          provider: data.provider,
	          providerId: data.providerId,
	          avatar: data.avatar
	        },function(resp){
	        	console.log('resouce user save success', resp);
	        },function(err){
	        	console.log('resouce user save error', err);
	        })
	        .$promise
	        .then( function(r) {
	        	console.log('user savee!!', r);
	          data._id = r._id;
	          setAuth(data, self);

	          // angular.copy(data, self);
	          // self.isLogged = true;
	          // self._id = r._id;

	          setTokenCookie(r.token);

	          // TODO ver se angular.extend nao substitui apply
			  //$rootScope.$apply();
	        })
	        .catch( function(err) {
	        	console.log('resource save catch', err);
	        	err = err.data;
	        	// if(err.errors.length){
	        	// 	alert(err.errors[0].message);
	        	// }
	        	if(err.errors)
					angular.forEach(err.errors, function(error, field) {
						console.log('save catch field=',field,'err=', error);
						//$scope.errors[field] = error.message;
						//alert(error.message);
					});

	          // exemplo !
	          // $scope.errors = {};
	          // // Update validity of form fields that match the mongoose errors
	          // angular.forEach(err.errors, function(error, field) {
	          //   form[field].$setValidity('mongoose', false);
	          //   $scope.errors[field] = error.message;
	          // });
	        });
    	}else{
    		// se não for novo faz login.
    		var user = {};
    		user.email = data.email;
    		user.password = data.providerId;
    		var onCatch = function(err){
    			// TODO
    			// apresenta erro na UI
    			console.log('erro ao logar com provider, self-',self, err);
    		};
    		var onThen = function(r){
    			console.log('user provider onthen', r);
    			if(r && r._id){
    				//acerto

    				setAuth(r, self);
					// angular.copy(data, self);
					// self.isLogged = true;

    			}else{
    				//error
    				onCatch(r);
    			}
    		};
    		self.auth(user, onThen, onCatch);
    	};

    	// dispara evento de ajuste de tela;
    	$body.trigger('Screen.Resize');
		
	});
	self.auth = function(user, onThen, onCatch){
		onThen = onThen || angular.noop;
		onCatch = onCatch || angular.noop;
		$http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
        	if(data && data.token){
        		//$cookies.put('token', data.token);
        		setTokenCookie(data.token);
        		resource.get()
						.$promise
				        .then( function(r) {
				        	if(r && r._id){
				        		setAuth(r);
								// self.isLogged = true;
								// angular.extend(self, r);
							}
							console.log('User auth get currentUser', r, 'self', self, r._id);
							onThen(r);
				        })
				        .catch( function(err) {
				        	console.log('User auth get currentUser error', err);
				        	onCatch(err);
						});

				// var currentUser = resource.get();
				// self.isLogged = true;
				// console.log('User auth get currentUser', currentUser);
				// angular.extend(self, currentUser);
				// return onThen(data);
        	}else{
        		return onCatch(data);
        	}

        	// dispara evento de ajuste de tela;
    		$body.trigger('Screen.Resize');
			
        }).
        error(function(err) {
			//this.logout();
			//deferred.reject(err);
			return onCatch(err);
		}.bind(this));
	};
	self.authProvider = function(providerName, callback){
		callback = callback || angular.noop;
		console.log('User authProvider', providerName);

		providers[providerName].authenticate(callback);
	};
	self.register = function(user, onThen, onCatch){
		console.log('User register', user);
		onThen = onThen || angular.noop;
		onCatch = onCatch || angular.noop;
		resource.save({
          name: user.name,
          email: user.email,
          password: user.password,
          provider: '',
          providerId: ''
        },function(resp){
        	//$cookies.put('token', resp.token);
        	setTokenCookie(resp.token);
        	self._id = resp._id;
        	console.log('resouce user save success', resp);
        	console.log('resouce.get()',resource.get());
        },function(err){
        	console.log('resouce user save error', err);
        })
        .$promise
        .then( function(r) {
        	console.log('user savee!!', r);
          	// Account created, redirect to home
          	//$location.path('/');
        	if(r && r._id){
        		//self._id = r._id;
        		//angular.copy(r._id, self._id);
       		};
          	// dispara evento de ajuste de tela;
    	  	$body.trigger('Screen.Resize');

          	onThen(r);
        })
        .catch( function(err) {
        	err = err.data;
        	// if(err.errors.length){
        	// 	alert(err.errors[0].message);
        	// }
			angular.forEach(err.errors, function(error, field) {
				console.log('save catch field=',field,'err=', error);
				//$scope.errors[field] = error.message;
				//alert(error.message);
			});
			onCatch(err);
        });
	};
	self.registerProvider = function(providerName, callback){
		callback = callback || angular.noop;
		console.log('User registerProvider providerName', providerName);
		
		providers[providerName].register(callback);

	};
	self.logout = function(){
		$cookies.remove('token');
		self.isLogged = false;
        angular.extend(self, UserModel);
        self.playlists = [];
        $body.trigger('Screen.Resize');
	};
	self.savePlaylist = function(data, onThen, onCatch){
		onThen = onThen || angular.noop;
		onCatch = onCatch || angular.noop;
		console.log('User savePlaylist ,self',self);
		resource.savePlaylist(
			{
				id: self._id
			},
			data
		)
		.$promise
        .then( function(r) {
        	console.log('create playlist savee!!', r);
          // Account created, redirect to home
          //$location.path('/');

          // dispara evento de ajuste de tela;
    	  $body.trigger('Screen.Resize');

          onThen(r);
        })
        .catch( function(err) {
        	err = err.data;
        	// if(err.errors.length){
        	// 	alert(err.errors[0].message);
        	// }
			angular.forEach(err.errors, function(error, field) {
				console.log('save catch field=',field,'err=', error);
				//$scope.errors[field] = error.message;
				//alert(error.message);
			});
			onCatch(err);
        });
	};
	self.deletePlaylist = function(data, onThen, onCatch){
		onThen = onThen || angular.noop;
		onCatch = onCatch || angular.noop;
		console.log('User deletePlaylist ,data',data);
		resource.deletePlaylist(
			{
				id: self._id
			},
			data
		)
		.$promise
        .then( function(r) {
        	console.log('deletePlaylist ok!!', r);
          // Account created, redirect to home
          //$location.path('/');

          // dispara evento de ajuste de tela;
    	  $body.trigger('Screen.Resize');

          onThen(r);
        })
        .catch( function(err) {
        	console.log('deletePlaylist catch err',err);
			onCatch(err);
        });
	};

	//Propriedades
	self._id = null;
	self.isLogged = false;
	self.name = '';
	self.email = '';
	self.password = '';
	self.playlists = [];

	return self;
});

app.factory('authInterceptor', function ($rootScope, $q, $cookies, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
      	console.debug('authInterceptor request', config);
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
      	console.debug('authInterceptor responseError', response);
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      // Auth.isLoggedInAsync(function(loggedIn) {
      //   if (next.authenticate && !loggedIn) {
      //     event.preventDefault();
      //     $location.path('/login');
      //   }
      // });
    });
  });