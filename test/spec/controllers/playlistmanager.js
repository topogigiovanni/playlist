'use strict';

describe('Controller: PlaylistManagerCtrl', function () {

  // load the controller's module
  beforeEach(module('playlistApp'));

  var PlaylistmanagerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaylistmanagerCtrl = $controller('PlaylistManagerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
