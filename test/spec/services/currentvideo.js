'use strict';

describe('Service: currentvideo', function () {

  // load the service's module
  beforeEach(module('playlistApp'));

  // instantiate service
  var currentvideo;
  beforeEach(inject(function (_CurrentVideo_) {
    currentvideo = _CurrentVideo_;
  }));

  it('should do something', function () {
    //expect(!!currentvideo).toBe(true);
  });

});
