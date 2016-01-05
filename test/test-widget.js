/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('esri-appbuilder-js:widget subgenerator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.widget = helpers.createGenerator('esri-appbuilder-js:widget', [
        '../../widget'
      ]);
      console.log('cleared folder and created widget generator');
      done();
    }.bind(this));
  });

  describe('when creating an inPanel widget', function() {

    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig', 'hasUIFile' ]
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/Widget.html',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json'
        // TODO: settings
      ];
      // TODO: replace w/ assertFileContent(pairs)?
      // see: http://yeoman.github.io/generator/assert.html
      helpers.assertFile(expected);
    });

    it('should set Label to widgetTitle', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('has baseClass in widget', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('has baseClass in css', function() {
      helpers.assertFileContent('widgets/TestWidget/css/style.css', /\.test-widget/);
    });

    it('references nls in template', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('has title/description in nls', function() {
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });

  describe('when creating a non-inPanel widget', function() {

    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'hasLocale', 'hasStyle', 'hasConfig', 'hasUIFile' ]
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/Widget.html',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json'
        // TODO: settings
      ];
      helpers.assertFile(expected);
    });

    it('should set Label to widgetTitle', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('sets inPanel to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"inPanel": false/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('has baseClass in widget', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('has baseClass in css', function() {
      helpers.assertFileContent('widgets/TestWidget/css/style.css', /\.test-widget/);
    });

    it('references nls in template', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('has title/description in nls', function() {
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });

  describe('when creating a widget w/o locale', function() {

    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasStyle', 'hasConfig', 'hasUIFile' ]
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/Widget.html',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json'
        // TODO: settings
      ];
      helpers.assertFile(expected);
      helpers.assertNoFile('widgets/TestWidget/nls/strings.js');
    });

    it('should set Label to widgetTitle', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasLocale": false/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('has baseClass in widget', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('has baseClass in css', function() {
      helpers.assertFileContent('widgets/TestWidget/css/style.css', /\.test-widget/);
    });

    it('does not reference nls in template', function() {
      helpers.assertNoFileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('references title/description in template', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.html', /Test Widget/);
      helpers.assertFileContent('widgets/TestWidget/Widget.html', /A test widget\./);
    });
  });

  describe('when creating a widget w/o style', function() {

    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasConfig', 'hasUIFile' ]
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/Widget.html',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json'
        // TODO: settings
      ];
      helpers.assertFile(expected);
      helpers.assertNoFile('widgets/TestWidget/css/style.css');
    });

    it('should set Label to widgetTitle', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasStyle to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasStyle": false/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('has baseClass in widget', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('references nls in template', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('has title/description in nls', function() {
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });

  describe('when creating a widget w/o config', function() {

    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasUIFile' ]
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/Widget.html',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json'
        // TODO: settings
      ];
      helpers.assertFile(expected);
      helpers.assertNoFile('widgets/TestWidget/config.json');
    });

    it('should set Label to widgetTitle', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('sets manifest hasConfig to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasConfig": false/);
    });

    it('has baseClass in widget', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('references nls in template', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('has title/description in nls', function() {
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });


  describe('when creating a widget w/o template', function() {

    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ]
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json'
        // TODO: settings
      ];
      helpers.assertFile(expected);
      helpers.assertNoFile('widgets/TestWidget/Widget.html');
    });

    it('should set Label to widgetTitle', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('sets manifest hasUIFile to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasUIFile": false/);
    });

    it('has baseClass in widget', function() {
      helpers.assertFileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('has title/description in nls', function() {
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      helpers.assertFileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });

/** SETTINGS */

  describe('when creating a widget with settings', function() {
    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: true,
        settingsFeatures: [ 'hasSettingUIFile', 'hasSettingLocale', 'hasSettingStyle' ]
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json',
        'widgets/TestWidget/setting/Setting.js',
        'widgets/TestWidget/setting/Setting.html',
        'widgets/TestWidget/setting/css/style.css',
        'widgets/TestWidget/setting/nls/strings.js'
      ];
    });

    it('should set hasSettingUIFile to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": true/);
    });

    it('should set hasSettingLocale to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": true/);
    });

    it('should set hasSettingStyle to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": true/);
    });

    it('has baseClass in Setting.js', function() {
      helpers.assertFileContent('widgets/TestWidget/setting/Setting.js', /baseClass: 'test-widget-setting'/);
    });
  });

  describe('when creating a widget without settings', function() {
    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: false
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json'
      ];
      helpers.assertFile(expected);
      helpers.assertNoFile('widgets/TestWidget/setting/Setting.js');
      helpers.assertNoFile('widgets/TestWidget/setting/Setting.html');
      helpers.assertNoFile('widgets/TestWidget/setting/css/style.css');
      helpers.assertNoFile('widgets/TestWidget/setting/nls/strings.js');
    });

    it('should set hasSettingUIFile to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": false/);
    });

    it('should set hasSettingLocale to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": false/);
    });

    it('should set hasSettingStyle to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": false/);
    });
  });

  describe('when creating a widget with settings without style', function() {
    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: true,
        settingsFeatures: [ 'hasSettingUIFile', 'hasSettingLocale' ]
      });
      this.widget.run({}, function () {
        done();
      });


    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json',
        'widgets/TestWidget/setting/Setting.js',
        'widgets/TestWidget/setting/Setting.html',
        'widgets/TestWidget/setting/nls/strings.js'
      ];

      helpers.assertFile(expected);
      helpers.assertNoFile('widgets/TestWidget/setting/css/style.css');
    });

    it('should set hasSettingUIFile to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": true/);
    });

    it('should set hasSettingLocale to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": true/);
    });

    it('should set hasSettingStyle to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": false/);
    });
  });

  describe('when creating a widget with settings without locale', function() {
    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: true,
        settingsFeatures: [ 'hasSettingUIFile', 'hasSettingStyle' ]
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json',
        'widgets/TestWidget/setting/Setting.js',
        'widgets/TestWidget/setting/Setting.html',
        'widgets/TestWidget/setting/css/style.css'
      ];
      helpers.assertFile(expected);
      helpers.assertNoFile('widgets/TestWidget/setting/nls/strings.js');
    });

    it('should set hasSettingUIFile to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": true/);
    });

    it('should set hasSettingLocale to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": false/);
    });

    it('should set hasSettingStyle to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": true/);
    });
  });

  describe('when creating a widget with settings without UIFile', function() {
    beforeEach(function(done) {
      helpers.mockPrompt(this.widget, {
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: true,
        settingsFeatures: [ 'hasSettingLocale', 'hasSettingStyle' ]
      });
      this.widget.run({}, function () {
        done();
      });
    });

    it('creates expected files', function (/*done*/) {
      var expected = [
        // add files you expect to exist here.
        'widgets/TestWidget/Widget.js',
        'widgets/TestWidget/config.json',
        'widgets/TestWidget/css/style.css',
        'widgets/TestWidget/nls/strings.js',
        'widgets/TestWidget/images/icon.png',
        'widgets/TestWidget/manifest.json',
        'widgets/TestWidget/setting/Setting.js',
        'widgets/TestWidget/setting/css/style.css',
        'widgets/TestWidget/setting/nls/strings.js'
      ];

      helpers.assertFile(expected);
      helpers.assertNoFile('widgets/TestWidget/setting/Setting.html');
    });

    it('should set hasSettingUIFile to false in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": false/);
    });

    it('should set hasSettingLocale to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": true/);
    });

    it('should set hasSettingStyle to true in manifest', function() {
      helpers.assertFileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": true/);
    });
  });

});
