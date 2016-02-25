'use strict';
var path = require('path');
var Base = require('yeoman-generator').Base;
var chalk = require('chalk');
var dasherize = require('underscore.string/dasherize');
var utils = require('./utils');

var WidgetGenerator = Base.extend({
  askFor: function () {
    var done = this.async();

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
          value: 'hasUIFile',
          name: 'Template (HTML) file'
        }
      ],
      'default': [ 'inPanel', 'hasLocale', 'hasStyle', 'hasConfig', 'hasUIFile' ]
    },
    {
      when: function (response) {
        // only show this step if user answered TRUE to 'hasConfig'
        return response.features.indexOf('hasConfig') > -1;
      },
      type: 'confirm',
      message: 'Would you like a settings page?',
      name: 'hasSettingPage'
    },
    {
      when: function (response) {
        // only show this step if user answered TRUE to 'hasSettingPage'
        return response.hasSettingPage;
      },
      type: 'checkbox',
      message: 'Which settings page features would you like to include?',
      name: 'settingsFeatures',
      choices: [
        {
          value: 'hasSettingUIFile',
          name: 'Settings template (HTML) file'
        },
        {
          value: 'hasSettingLocale',
          name: 'Settings locale (i18n) file'
        },
        {
          value: 'hasSettingStyle',
          name: 'Settings style (CSS) file'
        }
      ],
      'default': [ 'hasSettingUIFile', 'hasSettingLocale', 'hasSettingStyle' ]
    }];

    this.prompt(prompts, function (props) {
      this.widgetName = props.widgetName;
      this.widgetTitle = props.widgetTitle;
      this.description = props.description;

      // properties that we need to get from the package json, if it exists:
      this.author = utils.authorToString(utils.getPackageInfo('author'));
      this.license = (utils.getPackageInfo('license') !== false ? utils.getPackageInfo('license') : '');

      this.widgetsType = this.config.get('widgetsType');
      this.is2d = (this.widgetsType === 'is2d');
      this.is3d = (this.widgetsType === 'is3d');
      if(this.is3d) 
         this.platform = 'HTML3D'; 
      else this.platform = 'HTML'; 

      this.baseClass = props.baseClass;
      this.inPanel = props.features.indexOf('inPanel') > -1;
      this.hasLocale = props.features.indexOf('hasLocale') > -1;
      this.hasStyle = props.features.indexOf('hasStyle') > -1;
      this.hasConfig = props.features.indexOf('hasConfig') > -1;
      this.hasUIFile = props.features.indexOf('hasUIFile') > -1;
      // settings
      this.hasSettingPage = props.hasSettingPage;
      this.hasSettingUIFile = this.hasSettingPage ? (props.settingsFeatures.indexOf('hasSettingUIFile') > -1) : false;
      this.hasSettingLocale = this.hasSettingPage ? (props.settingsFeatures.indexOf('hasSettingLocale') > -1) : false;
      this.hasSettingStyle = this.hasSettingPage ? (props.settingsFeatures.indexOf('hasSettingStyle') > -1) : false;
      this.needsManifestProps = (!this.inPanel || !this.hasLocale);
      done();
    }.bind(this));
  },

  files: function () {
    var basePath = path.join('widgets', this.widgetName);
    this.template('_Widget.js', path.join(basePath, 'Widget.js'));
    if (this.hasUIFile) {
      this.template('_Widget.html', path.join(basePath, 'Widget.html'));
    }
    if (this.hasConfig) {
      this.template('_config.json', path.join(basePath, 'config.json'));
    }
    if (this.hasStyle) {
      this.template('css/_style.css', path.join(basePath, 'css/style.css'));
    }
    if (this.hasLocale) {
      this.template('nls/_strings.js', path.join(basePath, 'nls/strings.js'));
    }
    this.copy('images/icon.png', path.join(basePath, 'images/icon.png'));
    this.template('_manifest.json', path.join(basePath, 'manifest.json'));
    
    // Settings:
    if(this.hasSettingPage) {
      this.template('setting/_Setting.js', path.join(basePath, 'setting/Setting.js'));
      if (this.hasSettingUIFile) {
        this.template('setting/_Setting.html', path.join(basePath, 'setting/Setting.html'));
      }
      if (this.hasSettingLocale) {
        this.template('setting/nls/_strings.js', path.join(basePath, 'setting/nls/strings.js'));
      }
      if (this.hasSettingStyle) {
        this.template('setting/css/_style.css', path.join(basePath, 'setting/css/style.css'));
      }
    }
  }
});

module.exports = WidgetGenerator;
