/*global describe, before, it */
'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var mkdirp = require('mkdirp');
var fs = require('fs');

var wabRoot = 'wab_root';
var appDirId = '5'; // arbitrary number since we're creating everything anyway.
var appTitle = 'TestTitle'; // arbitrary title
var appDirPath = path.join(wabRoot, 'server', 'apps', appDirId);
var configFilePath = path.join(appDirPath, 'config.json');
var configFileContents = '{title:"' + appTitle + '"}';

describe('esri-appbuilder-js:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        'abort': false,
        'wabRoot': wabRoot,
        'appDirId': appDirId,
        'useSass': true
      }).inTmpDir(function(/*dir*/) {
        var done = this.async();
        mkdirp(appDirPath, function () {
          fs.writeFileSync(configFilePath, configFileContents);
          done();
        });
      })
      .on('end', done);
  });

  // TODO: test for existence of widgets folder?

  it('creates expected dotfiles', function () {
    var expected = [
      '.editorconfig',
      '.babelrc',
      '.yo-rc.json'
    ];
    assert.file(expected);
  });

  it('the sass setting is stored in config', function() {
    assert.fileContent('.yo-rc.json', /"useSass": true/);
  });

  describe('when creating gruntfile', function() {
    it('sets stemappDir variable', function() {
      assert.fileContent('Gruntfile.js', new RegExp('var stemappDir = \'' + path.join(wabRoot, 'client', 'stemapp').replace(/\\/g, '/')));
    });
    it('sets appDir variable', function() {
      assert.fileContent('Gruntfile.js', new RegExp('var appDir = \'' + path.join(wabRoot, 'server', 'apps', appDirId).replace(/\\/g, '/')));
    });
    it('sets watch config', function() {
      assert.fileContent('Gruntfile.js', new RegExp('watch:'));
    });
    it('loads watch task', function() {
      assert.fileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-contrib-watch'\);/);
    });
    it('sets sync config', function() {
      assert.fileContent('Gruntfile.js', new RegExp('sync:'));
    });
    it('loads sync task', function() {
      assert.fileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-sync'\);/);
    });
    it('registers default task', function() {
      assert.fileContent('Gruntfile.js', /grunt.registerTask\('default',/);
    });


    it('sets sass config', function() {
      assert.fileContent('Gruntfile.js', new RegExp('sass:'));
    });
    it('loads sass task', function() {
      assert.fileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-sass'\);/);
    });
  });
});

describe('esri-appbuilder-js:app no sass', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        'abort': false,
        'wabRoot': wabRoot,
        'appDirId': appDirId,
        'useSass': false
      }).inTmpDir(function(/*dir*/) {
        var done = this.async();
        mkdirp(appDirPath, function () {
          fs.writeFileSync(configFilePath, configFileContents);
          done();
        });
      })
      .on('end', done);
  });

  it('creates expected dotfiles', function () {
    var expected = [
      '.jshintrc',
      '.editorconfig',
      '.yo-rc.json'
    ];
    assert.file(expected);
  });

  it('the sass setting is stored in config', function() {
    assert.fileContent('.yo-rc.json', /"useSass": false/);
  });

  describe('when creating gruntfile', function() {

    it('does not set sass config', function() {
      assert.noFileContent('Gruntfile.js', new RegExp('sass:'));
    });
    it('does not load sass task', function() {
      assert.noFileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-sass'\);/);
    });
  });
});

describe('esri-appbuilder-js generator - no app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        'abort': false,
        'wabRoot': wabRoot,
        'appDirId': 'None'
      }).inTmpDir(function(/*dir*/) {
        var done = this.async();
        mkdirp(appDirPath, function () {
          fs.writeFileSync(configFilePath, configFileContents);
          done();
        });
      })
      .on('end', done);
  });

  describe('when creating gruntfile', function() {
    it('appDir set to "todo"', function() {
      assert.fileContent('Gruntfile.js', new RegExp('var appDir = \'TODO(.*)'));
    });
    // TODO - not testing the other parts of the gruntfile here since it's the same as the previous
    // case. That common code should be pulled out in the future.
  });
});

describe('esri-appbuilder-js abort', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        'abort': true,
        'wabRoot': wabRoot,
        'appDirId': appDirId
      })
      .on('end', done);
  });

  it('does not create dotfiles or Gruntfile', function () {
    var expected = [
      '.editorconfig',
      'Gruntfile.js'
    ];
    assert.noFile(expected);
  });
});

describe('esri-appbuilder-js:3dapp', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        'abort': false,
        'wabRoot': wabRoot,
        'appDirId': appDirId,
        'widgetsType': 'is3d'
      }).inTmpDir(function(/*dir*/) {
        var done = this.async();
        mkdirp(appDirPath, function () {
          fs.writeFileSync(configFilePath, configFileContents);
          done();
        });
      })
      .on('end', done);
  });

  // TODO: test for existence of widgets folder?

  it('creates expected dotfiles', function () {
    var expected = [
      '.editorconfig',
      '.yo-rc.json'
    ];
    assert.file(expected);
  });

  it('the 3d choice is stored in config', function() {
    assert.fileContent('.yo-rc.json', /"widgetsType": "is3d"/);
  });

  describe('when creating gruntfile', function() {
    it('sets stemappDir variable', function() {
      assert.fileContent('Gruntfile.js', new RegExp('var stemappDir = \'' + path.join(wabRoot, 'client', 'stemapp3d').replace(/\\/g, '/')));
    });
    it('sets appDir variable', function() {
      assert.fileContent('Gruntfile.js', new RegExp('var appDir = \'' + path.join(wabRoot, 'server', 'apps', appDirId).replace(/\\/g, '/')));
    });
    it('sets watch config', function() {
      assert.fileContent('Gruntfile.js', new RegExp('watch:'));
    });
    it('loads watch task', function() {
      assert.fileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-contrib-watch'\);/);
    });
    it('sets sync config', function() {
      assert.fileContent('Gruntfile.js', new RegExp('sync:'));
    });
    it('loads sync task', function() {
      assert.fileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-sync'\);/);
    });
    it('registers default task', function() {
      assert.fileContent('Gruntfile.js', /grunt.registerTask\('default',/);
    });
  });
});

describe('esri-appbuilder-js generator - 3d no app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        'abort': false,
        'wabRoot': wabRoot,
        'appDirId': 'None',
        'widgetsType': 'is3d'
      }).inTmpDir(function(/*dir*/) {
        var done = this.async();
        mkdirp(appDirPath, function () {
          fs.writeFileSync(configFilePath, configFileContents);
          done();
        });
      })
      .on('end', done);
  });

  it('the 3d choice is stored in config', function() {
    assert.fileContent('.yo-rc.json', /"widgetsType": "is3d"/);
  });

  describe('when creating gruntfile', function() {
    it('appDir set to "todo"', function() {
      assert.fileContent('Gruntfile.js', new RegExp('var appDir = \'TODO(.*)'));
    });
    // TODO - not testing the other parts of the gruntfile here since it's the same as the previous
    // case. That common code should be pulled out in the future.
  });
});

describe('esri-appbuilder-js 3d abort', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        'abort': true,
        'wabRoot': wabRoot,
        'appDirId': appDirId,
        'widgetsType': 'is3d'
      })
      .on('end', done);
  });

  it('does not create dotfiles or Gruntfile', function () {
    var expected = [
      '.editorconfig',
      '.yo-rc.json',
      'Gruntfile.js'
    ];
    assert.noFile(expected);
  });
});
