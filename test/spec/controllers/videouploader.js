'use strict';

describe('Controller: VideouploaderCtrl', function () {

  // load the controller's module
  beforeEach(module('playlistApp'));

  var VideouploaderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideouploaderCtrl = $controller('VideoUploaderCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  
});
