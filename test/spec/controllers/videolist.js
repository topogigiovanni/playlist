'use strict';

describe('Controller: VideolistCtrl', function () {

  // load the controller's module
  beforeEach(module('playlistApp'));

  var VideolistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideolistCtrl = $controller('VideoListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));


});
