/*global describe, before, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('esri-appbuilder-js generator', function () {
  before(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('esri-appbuilder-js:app', [
        '../../app'
      ]);

      helpers.mockPrompt(this.app, {
        'author': 'Tom Wayson',
        'wabRoot': 'C:\\code\\arcgis-web-appbuilder-1.3'
      });
      this.app.options['skip-install'] = true;
      this.app.run({}, function () {
        done();
      });
    }.bind(this));
  });

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
      helpers.assertFileContent('Gruntfile.js', /var stemappDir = 'C:\/code\/arcgis-web-appbuilder-1.3\/client\/stemapp'/);
    });
    it('sets appDir variable', function() {
      helpers.assertFileContent('Gruntfile.js', /var appDir = 'C:\/code\/arcgis-web-appbuilder-1.3\/server\/apps\/2'/);
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
