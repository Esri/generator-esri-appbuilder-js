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
        'appDirId': appDirId
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
      '.jshintrc',
      '.editorconfig'
    ];
    assert.file(expected);
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
      '.jshintrc',
      '.editorconfig',
      'Gruntfile.js'
    ];
    assert.noFile(expected);
  });
});
