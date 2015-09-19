'use strict';

describe('Controller: SearchCtrl', function () {

  // load the controller's module
  beforeEach(module('playlistApp'));

  var SearchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchCtrl = $controller('SearchCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));


});
