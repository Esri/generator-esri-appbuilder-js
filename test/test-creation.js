/*global describe, before, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var mkdirp = require('mkdirp');
var fs = require('fs');

var wabRoot = path.join(__dirname, 'temp');
var appDirId = '5'; // arbitrary number since we're creating everything anyway.
var appTitle = 'TestTitle'; // arbitrary title
var appDirPath = path.join('server', 'apps', appDirId);
var filePath = path.join(appDirPath, 'config.json');
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
      mkdirp(appDirPath, function (err) {
        if (err) {
          console.error(err);
        } else {
          fs.writeFileSync(filePath, configFileContents);

          this.app = helpers.createGenerator('esri-appbuilder-js:app', [
            '../../app'
          ]);

          helpers.mockPrompt(this.app, {
            'abort': false,
            'wabRoot': wabRoot,
            'appDirId': appDirId
          });
          this.app.options['skip-install'] = true;
          this.app.run({}, function () {
            done();
          });
        }
      }.bind(this));
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

      mkdirp(appDirPath, function (err) {
        if (err) {
          console.error(err);
        } else {
          fs.writeFileSync(filePath, configFileContents);

          this.app = helpers.createGenerator('esri-appbuilder-js:app', [
            '../../app'
          ]);

          helpers.mockPrompt(this.app, {
            'abort': false,
            'wabRoot': wabRoot,
            'appDirId': 'None'
          });
          this.app.options['skip-install'] = true;
          this.app.run({}, function () {
            done();
          });
        }
      }.bind(this));
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

describe('esri-appbuilder-js abort', function () {
  before(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      mkdirp(appDirPath, function (err) {
        if (err) {
          console.error(err);
        } else {
          fs.writeFileSync(filePath, configFileContents);

          this.app = helpers.createGenerator('esri-appbuilder-js:app', [
            '../../app'
          ]);

          helpers.mockPrompt(this.app, {
            'abort': true,
            'wabRoot': wabRoot,
            'appDirId': appDirId
          });
          this.app.options['skip-install'] = true;
          this.app.run({}, function () {
            done();
          });
        }
      }.bind(this));
    }.bind(this));
  });

  it('does not create dotfiles or Gruntfile', function () {
    var expected = [
      '.jshintrc',
      '.editorconfig',
      'Gruntfile.js'
    ];
    helpers.assertNoFile(expected);
  });
});
