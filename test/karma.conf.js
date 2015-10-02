// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-09-18 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'public/bower_components/jquery/dist/jquery.js',
      'public/bower_components/angular/angular.js',
      'public/bower_components/eventEmitter/EventEmitter.js',
      'public/bower_components/eventie/eventie.js',
      'public/bower_components/imagesloaded/imagesloaded.pkgd.js',
      'public/bower_components/angular-images-loaded/angular-images-loaded.js',
      'public/bower_components/get-style-property/get-style-property.js',
      'public/bower_components/get-size/get-size.js',
      'public/bower_components/doc-ready/doc-ready.js',
      'public/bower_components/matches-selector/matches-selector.js',
      'public/bower_components/fizzy-ui-utils/utils.js',
      'public/bower_components/outlayer/item.js',
      'public/bower_components/outlayer/outlayer.js',
      'public/bower_components/masonry/dist/masonry.pkgd.js',
      'public/bower_components/jquery-bridget/jquery.bridget.js',
      'public/bower_components/angular-masonry/angular-masonry.js',
      'public/bower_components/angular-messages/angular-messages.js',
      'public/bower_components/bootstrap/dist/js/bootstrap.js',
      'public/bower_components/bootswatch-dist/js/bootstrap.js',
      'public/bower_components/jquery-mousewheel/jquery.mousewheel.js',
      'public/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
      'public/bower_components/ng-scrollbars/dist/scrollbars.min.js',
      'public/bower_components/ng-sortable/dist/ng-sortable.js',
      'public/bower_components/underscore/underscore.js',
      'public/bower_components/angular-resource/angular-resource.js',
      'public/bower_components/angular-cookies/angular-cookies.js',
      'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'public/bower_components/angular-sanitize/angular-sanitize.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "public/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js",
      "https://f.vimeocdn.com/js/froogaloop2.min.js",
      "https://www.youtube.com/iframe_api"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
