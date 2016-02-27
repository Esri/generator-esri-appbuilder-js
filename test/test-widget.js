/*global describe, before, beforeEach, it */
'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

var generatorPath = path.join(__dirname, '../widget');
var testAuthorName = 'Barney Rubble';
var testAuthorEmail = 'b@rubble.com';
var testAuthorUrl = 'http://barnyrubble.tumblr.com';
var testLicense = 'Apache-2.0';

describe('esri-appbuilder-js:widget subgenerator', function () {

  describe('when creating an inPanel widget', function() {

    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig', 'hasUIFile' ]
      })
      .on('end', done);
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
      assert.file(expected);
    });

    it('should set Label to widgetTitle', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('has baseClass in widget', function() {
      assert.fileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('has baseClass in css', function() {
      assert.fileContent('widgets/TestWidget/css/style.css', /\.test-widget/);
    });

    it('references nls in template', function() {
      assert.fileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('has title/description in nls', function() {
      assert.fileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      assert.fileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });

  describe('when creating a non-inPanel widget', function() {

    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'hasLocale', 'hasStyle', 'hasConfig', 'hasUIFile' ]
      })
      .on('end', done);
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
      assert.file(expected);
    });

    it('should set Label to widgetTitle', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('sets inPanel to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"inPanel": false/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('has baseClass in widget', function() {
      assert.fileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('has baseClass in css', function() {
      assert.fileContent('widgets/TestWidget/css/style.css', /\.test-widget/);
    });

    it('references nls in template', function() {
      assert.fileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('has title/description in nls', function() {
      assert.fileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      assert.fileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });

  describe('when creating a widget w/o locale', function() {

    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasStyle', 'hasConfig', 'hasUIFile' ]
      })
      .on('end', done);
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
      assert.file(expected);
      assert.noFile('widgets/TestWidget/nls/strings.js');
    });

    it('should set Label to widgetTitle', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasLocale": false/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('has baseClass in widget', function() {
      assert.fileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('has baseClass in css', function() {
      assert.fileContent('widgets/TestWidget/css/style.css', /\.test-widget/);
    });

    it('does not reference nls in template', function() {
      assert.noFileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('references title/description in template', function() {
      assert.fileContent('widgets/TestWidget/Widget.html', /Test Widget/);
      assert.fileContent('widgets/TestWidget/Widget.html', /A test widget\./);
    });
  });

  describe('when creating a widget w/o style', function() {

    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasConfig', 'hasUIFile' ]
      })
      .on('end', done);
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
      assert.file(expected);
      assert.noFile('widgets/TestWidget/css/style.css');
    });

    it('should set Label to widgetTitle', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasStyle to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasStyle": false/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('has baseClass in widget', function() {
      assert.fileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('references nls in template', function() {
      assert.fileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('has title/description in nls', function() {
      assert.fileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      assert.fileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });

  describe('when creating a widget w/o config', function() {

    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasUIFile' ]
      })
      .on('end', done);
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
      assert.file(expected);
      assert.noFile('widgets/TestWidget/config.json');
    });

    it('should set Label to widgetTitle', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasUIFile to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasUIFile": true/);
    });

    it('sets manifest hasConfig to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasConfig": false/);
    });

    it('has baseClass in widget', function() {
      assert.fileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('references nls in template', function() {
      assert.fileContent('widgets/TestWidget/Widget.html', /\$\{nls\./);
    });

    it('has title/description in nls', function() {
      assert.fileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      assert.fileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });


  describe('when creating a widget w/o template', function() {

    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ]
      })
      .on('end', done);
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
      assert.file(expected);
      assert.noFile('widgets/TestWidget/Widget.html');
    });

    it('should set Label to widgetTitle', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"label": "Test Widget"/);
    });

    it('should set inPanel to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"inPanel": true/);
    });

    it('sets manifest hasLocale to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasLocale": true/);
    });

    it('sets manifest hasStyle to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasStyle": true/);
    });

    it('sets manifest hasConfig to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasConfig": true/);
    });

    it('sets manifest hasUIFile to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasUIFile": false/);
    });

    it('has baseClass in widget', function() {
      assert.fileContent('widgets/TestWidget/Widget.js', /baseClass: 'test-widget'/);
    });

    it('has title/description in nls', function() {
      assert.fileContent('widgets/TestWidget/nls/strings.js', /widgetTitle: "Test Widget"/);
      assert.fileContent('widgets/TestWidget/nls/strings.js', /description: "A test widget\."/);
    });

  });

/** SETTINGS */

  describe('when creating a widget with settings', function() {
    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: true,
        settingsFeatures: [ 'hasSettingUIFile', 'hasSettingLocale', 'hasSettingStyle' ]
      })
      .on('end', done);
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
      assert.file(expected);
    });

    it('should set hasSettingUIFile to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": true/);
    });

    it('should set hasSettingLocale to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": true/);
    });

    it('should set hasSettingStyle to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": true/);
    });

    it('has baseClass in Setting.js', function() {
      assert.fileContent('widgets/TestWidget/setting/Setting.js', /baseClass: 'test-widget-setting'/);
    });
  });

  describe('when creating a widget without settings', function() {
    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: false
      })
      .on('end', done);
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
      assert.file(expected);
      assert.noFile('widgets/TestWidget/setting/Setting.js');
      assert.noFile('widgets/TestWidget/setting/Setting.html');
      assert.noFile('widgets/TestWidget/setting/css/style.css');
      assert.noFile('widgets/TestWidget/setting/nls/strings.js');
    });

    it('should set hasSettingUIFile to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": false/);
    });

    it('should set hasSettingLocale to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": false/);
    });

    it('should set hasSettingStyle to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": false/);
    });
  });

  describe('when creating a widget with settings without style', function() {
    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: true,
        settingsFeatures: [ 'hasSettingUIFile', 'hasSettingLocale' ]
      })
      .on('end', done);


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

      assert.file(expected);
      assert.noFile('widgets/TestWidget/setting/css/style.css');
    });

    it('should set hasSettingUIFile to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": true/);
    });

    it('should set hasSettingLocale to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": true/);
    });

    it('should set hasSettingStyle to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": false/);
    });
  });

  describe('when creating a widget with settings without locale', function() {
    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: true,
        settingsFeatures: [ 'hasSettingUIFile', 'hasSettingStyle' ]
      })
      .on('end', done);
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
      assert.file(expected);
      assert.noFile('widgets/TestWidget/setting/nls/strings.js');
    });

    it('should set hasSettingUIFile to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": true/);
    });

    it('should set hasSettingLocale to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": false/);
    });

    it('should set hasSettingStyle to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": true/);
    });
  });

  describe('when creating a widget with settings without UIFile', function() {
    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig' ],
        hasSettingPage: true,
        settingsFeatures: [ 'hasSettingLocale', 'hasSettingStyle' ]
      })
      .on('end', done);
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

      assert.file(expected);
      assert.noFile('widgets/TestWidget/setting/Setting.html');
    });

    it('should set hasSettingUIFile to false in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingUIFile": false/);
    });

    it('should set hasSettingLocale to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingLocale": true/);
    });

    it('should set hasSettingStyle to true in manifest', function() {
      assert.fileContent('widgets/TestWidget/manifest.json', /"hasSettingStyle": true/);
    });
  });

  describe('when creating a widget that has a package.json', function() {
    before(function(done) {

      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      })
      .inTmpDir(function(dir) {
        console.log(path.join(dir, 'package.json'));
        fs.writeFileSync(path.join(dir, 'package.json'), '{"author":"' + testAuthorName + '", "license":"' + testLicense + '"}');
      })
      .on('end', done);
    });

    it('has author name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"author": "' + testAuthorName + '",'));
    });

    it('has license name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"license": "' + testLicense + '",'));
    });
  });

  describe('when creating a widget that has a package.json with author object - name only', function() {
    before(function(done) {

      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      })
      .inTmpDir(function(dir) {
        fs.writeFileSync(path.join(dir, 'package.json'), '{"author":{"name":"' + testAuthorName + '"}, "license":"' + testLicense + '"}');
      })
      .on('end', done);
    });

    it('has author name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"author": "' + testAuthorName + '",'));
    });

    it('has license name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"license": "' + testLicense + '",'));
    });
  });

  describe('when creating a widget that has a package.json with author object - author and email', function() {
    before(function(done) {

      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      })
      .inTmpDir(function(dir) {
        fs.writeFileSync(path.join(dir, 'package.json'), '{"author":{"name":"' + testAuthorName + '", "email":"' + testAuthorEmail + '"}, "license":"' + testLicense + '"}');
      })
      .on('end', done);
    });

    it('has author name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"author": "' + testAuthorName + ' <' + testAuthorEmail + '>",'));
    });

    it('has license name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"license": "' + testLicense + '",'));
    });
  });

  describe('when creating a widget that has a package.json with author object but no name property', function() {
    before(function(done) {

      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      })
      .inTmpDir(function(dir) {
        fs.writeFileSync(path.join(dir, 'package.json'), '{"author":{"url":"' + testAuthorUrl + '"}, "license":"' + testLicense + '"}');
      })
      .on('end', done);
    });

    it('has blank author in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"author": "",'));
    });

    it('has license name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"license": "' + testLicense + '",'));
    });
  });

  describe('when creating a widget that has a package.json with author object - author and url', function() {
    before(function(done) {

      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      })
      .inTmpDir(function(dir) {
        fs.writeFileSync(path.join(dir, 'package.json'), '{"author":{"name":"' + testAuthorName + '", "url":"' + testAuthorUrl + '"}, "license":"' + testLicense + '"}');
      })
      .on('end', done);
    });

    it('has author name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"author": "' + testAuthorName + ' \\(' + testAuthorUrl + '\\)"'));
    });

    it('has license name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"license": "' + testLicense + '",'));
    });
  });

  describe('when creating a widget that has a package.json with author object - author, email, url', function() {
    before(function(done) {

      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      })
      .inTmpDir(function(dir) {
        fs.writeFileSync(path.join(dir, 'package.json'), '{"author":{"name":"' + testAuthorName + '", "email":"' + testAuthorEmail + '", "url":"' + testAuthorUrl + '"}, "license":"' + testLicense + '"}');
      })
      .on('end', done);
    });

    it('has author name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"author": "' + testAuthorName + ' <' + testAuthorEmail + '> \\(' + testAuthorUrl + '\\)"'));
    });

    it('has license name in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"license": "' + testLicense + '",'));
    });
  });

  describe('when creating a widget that does not have a package.json', function() {
    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      })
      .on('end', done);
    });

    it('has blank author in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"author": "",'));
    });

    it('has blank license in manifest.json', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', new RegExp('"license": "",'));
    });
  });

  describe('when creating a widget that does not have the 2d/3d prompt set', function() {
    before(function(done) {
      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      })
      .on('end', done);
    });

    it('has wabVersion set to 1.4', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"wabVersion": "1.4",/);
    });

    it('has platform set to HTML', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"platform": "HTML",/);
    });

    it('has 2D set to true', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"2D": true,/);
    });

    it('has 3D set to false', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"3D": false/);
    });
  });


  describe('when creating a widget that has the 2d/3d prompt set to 2d', function() {
    before(function(done) {

      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      }).withLocalConfig({
        widgetsType: "is2d"
      })
      .on('end', done);
    });

    it('has wabVersion set to 1.4', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"wabVersion": "1.4"/);
    });

    it('has platform set to HTML', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"platform": "HTML"/);
    });

    it('has 2D set to true', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"2D": true/);
    });

    it('has 3D set to false', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"3D": false/);
    });
  });

  describe('when creating a widget that has the 2d/3d prompt set to 3d', function() {
    before(function(done) {

      helpers.run(generatorPath).withPrompts({
        widgetName: 'TestWidget',
        widgetTitle: 'Test Widget',
        description: 'A test widget.',
        path: 'widgets',
        baseClass: 'test-widget',
        features: [],
        hasSettingPage: false,
        settingsFeatures: [  ]
      }).withLocalConfig({
        widgetsType: "is3d"
      })
      .on('end', done);
    });

    it('has wabVersion set to 2.0beta', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"wabVersion": "2.0beta"/);
    });

    it('has platform set to HTML3D', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"platform": "HTML3D"/);
    });

    it('has 2D set to false', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"2D": false/);
    });

    it('has 3D set to true', function (/*done*/) {
      assert.fileContent('widgets/TestWidget/manifest.json', /"3D": true/);
    });
  });

});
