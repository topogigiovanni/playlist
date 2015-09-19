'use strict';

describe('Service: currentvideo', function () {

  // load the service's module
  beforeEach(module('playlistApp'));

  // instantiate service
  var currentvideo;
  beforeEach(inject(function (_currentvideo_) {
    currentvideo = _currentvideo_;
  }));

  it('should do something', function () {
    expect(!!currentvideo).toBe(true);
  });

});
