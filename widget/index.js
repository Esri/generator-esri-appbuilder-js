'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var WidgetGenerator = yeoman.generators.Base.extend({
  askFor: function () {
    var done = this.async();
    var dasherize = this._.dasherize;

    console.log(chalk.green('Welcome to the ArcGIS Web AppBuilder widget generator!'));

    var prompts = [{
      name: 'widgetName',
      message: 'Widget Name:',
      'default': 'MyWidget',
      // test for valid folder name
      validate: function(answer) {
        var validFolderNameRegExp = /^[^\\/?%*"":|<>\.\s]+$/;
        return validFolderNameRegExp.test(answer);
      }
    }, {
      name: 'widgetTitle',
      message: 'Widget Title:',
      // default to widget name split on caplital letters
      // Ex: MyWidget => My Widget
      'default': function(answers) {
        var title;
        if (answers && answers.widgetName && answers.widgetName.match) {
          title = answers.widgetName.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1).join(' ');
        } else {
          title = 'My Widget';
        }
        return title;
      }
    }, {
      name: 'description',
      message: 'Description:',
      'default': 'A custom Web AppBuilder widget.'
    },
    {
      name: 'baseClass',
      message: 'Base Class:',
      // default to dasherized widget name
      // Ex: MyWidget => my-widget
      'default': function(answers) {
        var baseClass;
        if (answers && answers.widgetName) {
          baseClass = dasherize(answers.widgetName).replace(/^-/,'');
        } else {
          baseClass = 'my-widget';
        }
        return baseClass;
      }
      // TODO: validate not empty string?
    },
    // TODO: checkbox prompt for 2D/3D once the WAB supports 3D
    {
      type: 'checkbox',
      message: 'Which features would you like to include?',
      name: 'features',
      choices: [
        {
          value: 'inPanel',
          name: 'Run inside a panel'
        },
        {
          value: 'hasLocale',
          name: 'Locale (i18n) file'
        },
        {
          value: 'hasStyle',
          name: 'Style (CSS) file'
        },
        {
          value: 'hasConfig',
          name: 'Config (JSON) file'
        },
        {
          value: 'hasUIfile',
          name: 'Template (HTML) file'
        }
      ],
      'default': [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig', 'hasUIfile' ]
    }];

    this.prompt(prompts, function (props) {
      this.widgetName = props.widgetName;
      this.widgetTitle = props.widgetTitle;
      this.description = props.description;
      // TODO: get from prompt once the WAB supports 3D
      this.is2d = true;
      this.is3d = false;
      this.baseClass = props.baseClass;
      this.inPanel = props.features.indexOf('inPanel') > -1;
      this.hasLocale = props.features.indexOf('hasLocale') > -1;
      this.hasStyle = props.features.indexOf('hasStyle') > -1;
      this.hasConfig = props.features.indexOf('hasConfig') > -1;
      this.hasUIfile = props.features.indexOf('hasUIfile') > -1;
      this.needsManifestProps = (!this.inPanel || !this.hasLocale);
      done();
    }.bind(this));
  },

  files: function () {
    // NOTE: this is needed b/c _Widget.html has ES6 style interpolation delimiters
    // see: https://github.com/lodash/lodash/issues/399
    this._.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;
    var basePath = path.join('widgets', this.widgetName);
    this.template('_Widget.js', path.join(basePath, 'Widget.js'));
    this.template('_Widget.html', path.join(basePath, 'Widget.html'));
    this.template('_config.json', path.join(basePath, 'config.json'));
    this.template('css/_style.css', path.join(basePath, 'css/style.css'));
    if (this.hasLocale) {
      this.template('nls/_strings.js', path.join(basePath, 'nls/strings.js'));
    }
    this.copy('images/icon.png', path.join(basePath, 'images/icon.png'));
    this.template('_manifest.json', path.join(basePath, 'manifest.json'));
    // TODO: settings
  }
});

module.exports = WidgetGenerator;
