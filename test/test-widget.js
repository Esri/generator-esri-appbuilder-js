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
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
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

    helpers.mockPrompt(this.widget, {
      widgetName: 'TestWidget',
      widgetTitle: 'Test Widget',
      description: 'A test widget.',
      path: 'widgets',
      cssPrefix: 'myapp-',
      'inPanel': true
    });
    this.widget.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
