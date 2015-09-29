'use strict';

describe('Controller: VideoplayerCtrl', function () {

  // load the controller's module
  beforeEach(module('playlistApp'));

  var VideoplayerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideoplayerCtrl = $controller('VideoPlayerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));


});
