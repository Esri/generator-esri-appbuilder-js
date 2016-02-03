/*global describe, before, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var util = require('./util');
var fs = require('fs');

var wabRoot = path.join(__dirname, 'temp');
var appDirId = '5'; // arbitrary number since we're creating everything anyway.
var appTitle = 'TestTitle'; // arbitrary title
var filePath = 'server/apps/' + appDirId + '/config.json';
var configFileContents = '{title:"' + appTitle + '"}';

describe('esri-appbuilder-js generator', function () {
  before(function (done) {
    helpers.testDirectory(wabRoot, function (err) {
      if (err) {
        return done(err);
      }

      // Write the config file to the "filePath", so it's available to
      // read when the generator goes to lookup the possible values
      // for the apps.
      util.ensureDirectoryExistence(filePath);
      fs.writeFileSync(filePath, configFileContents);

      this.app = helpers.createGenerator('esri-appbuilder-js:app', [
        '../../app'
      ]);

      helpers.mockPrompt(this.app, {
        'author': 'Tom Wayson',
        'wabRoot': wabRoot,
        'appDirId': appDirId
      });
      this.app.options['skip-install'] = true;
      this.app.run({}, function () {
        done();
      });
    }.bind(this));
  });

  // TODO: test for existence of widgets folder?

  it('creates expected dotfiles', function () {
    var expected = [
      '.jshintrc',
      '.editorconfig'
    ];
    helpers.assertFile(expected);
  });

  describe('when generating package.json', function() {
    it('sets author name', function() {
      helpers.assertFileContent('package.json', /"name": "Tom Wayson"/);
    });

    // TODO: test if package.json has properties
    it('sets dependencies', function() {
      helpers.assertFileContent('package.json', /"grunt": "\^0.4.5"/);
      helpers.assertFileContent('package.json', /"grunt-contrib-watch": "\^0.6.1"/);
      helpers.assertFileContent('package.json', /"grunt-sync": "\^0.5.1"/);
    });
  });

  describe('when creating gruntfile', function() {
    it('sets stemappDir variable', function() {
      helpers.assertFileContent('Gruntfile.js', new RegExp('var stemappDir = \'' + path.join(wabRoot, 'client', 'stemapp').replace(/\\/g, '/')));
    });
    it('sets appDir variable', function() {
      helpers.assertFileContent('Gruntfile.js', new RegExp('var appDir = \'' + path.join(wabRoot, 'server', 'apps', appDirId).replace(/\\/g, '/')));
    });
    it('sets watch config', function() {
      helpers.assertFileContent('Gruntfile.js', new RegExp('watch:'));
    });
    it('loads watch task', function() {
      helpers.assertFileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-contrib-watch'\);/);
    });
    it('sets sync config', function() {
      helpers.assertFileContent('Gruntfile.js', new RegExp('sync:'));
    });
    it('loads sync task', function() {
      helpers.assertFileContent('Gruntfile.js', /grunt.loadNpmTasks\('grunt-sync'\);/);
    });
    it('registers default task', function() {
      helpers.assertFileContent('Gruntfile.js', /grunt.registerTask\('default',/);
    });
  });
});

describe('esri-appbuilder-js generator - no app', function () {
  before(function (done) {
    helpers.testDirectory(wabRoot, function (err) {
      if (err) {
        return done(err);
      }

      util.ensureDirectoryExistence(filePath);
      fs.writeFileSync(filePath, configFileContents);

      this.app = helpers.createGenerator('esri-appbuilder-js:app', [
        '../../app'
      ]);

      helpers.mockPrompt(this.app, {
        'author': 'Tom Wayson',
        'wabRoot': wabRoot,
        'appDirId': 'None'
      });
      this.app.options['skip-install'] = true;
      this.app.run({}, function () {
        done();
      });
    }.bind(this));
  });

  describe('when creating gruntfile', function() {
    it('appDir set to "todo"', function() {
      helpers.assertFileContent('Gruntfile.js', new RegExp('var appDir = \'TODO(.*)'));
    });
    // TODO - not testing the other parts of the gruntfile here since it's the same as the previous
    // case. That common code should be pulled out in the future.
  });
});
