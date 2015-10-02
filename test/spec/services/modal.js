'use strict';

describe('Service: Modal', function () {

  // load the service's module
  beforeEach(module('playlistApp'));

  // instantiate service
  var Modal;
  beforeEach(inject(function (_Modal_) {
    Modal = _Modal_;
  }));

  it('should do something', function () {
    //expect(!!Modal).toBe(true);
  });

});
