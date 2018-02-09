'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const dasherize = require('underscore.string/dasherize');
const utils = require('./utils');

module.exports = class extends Generator {
  prompting() {
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

    this.prompt(prompts).then(function (props) {
      this.widgetName = props.widgetName;
      this.widgetTitle = props.widgetTitle;
      this.description = props.description;

      // properties that we need to get from the package json, if it exists:
      this.author = utils.authorToString(utils.getPackageInfo('author'));
      this.license = (utils.getPackageInfo('license') !== false ? utils.getPackageInfo('license') : '');

      this.widgetsType = this.config.get('widgetsType');
      this.useSass = this.config.get('useSass');
      this.jsVersion = this.config.get('jsVersion');
      this.is2d = (this.widgetsType === 'is2d');
      this.is3d = (this.widgetsType === 'is3d');
      this.wabVersion = '2.7';

      if (this.is3d) {
        this.platform = 'HTML3D';
      } else {
        this.platform = 'HTML';
        this.is2d = true;
      }

      this.baseClass = props.baseClass;
      this.inPanel = props.features.indexOf('inPanel') > -1;
      this.hasLocale = props.features.indexOf('hasLocale') > -1;
      this.hasStyle = props.features.indexOf('hasStyle') > -1;
      this.hasConfig = props.features.indexOf('hasConfig') > -1;
      this.hasUIFile = props.features.indexOf('hasUIFile') > -1;
      // settings
      this.hasSettingPage = (props.hasSettingPage === true);
      this.hasSettingUIFile = this.hasSettingPage ? (props.settingsFeatures.indexOf('hasSettingUIFile') > -1) : false;
      this.hasSettingLocale = this.hasSettingPage ? (props.settingsFeatures.indexOf('hasSettingLocale') > -1) : false;
      this.hasSettingStyle = this.hasSettingPage ? (props.settingsFeatures.indexOf('hasSettingStyle') > -1) : false;
      this.needsManifestProps = (!this.inPanel || !this.hasLocale);
      done();
    }.bind(this));
  }

  writing() {
    var basePath = path.join('widgets', this.widgetName);
    if(this.jsVersion === 'ES2015TypeScript') {
      var templatePath = '_Widget_2d.ts';
      if(this.is3d) {
        templatePath = '_Widget_3d.ts';
      }
      this.fs.copyTpl(
        this.templatePath(templatePath), 
        this.destinationPath(path.join(basePath, 'Widget.ts')),
        this
      );

      // If we're using TypeScript, we also need the "declareDecorator" file.
      this.fs.copyTpl(
        this.templatePath('support/declareDecorator.ts'),
        this.destinationPath(path.join(basePath, 'support/declareDecorator.ts')),
        this
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('_Widget_' + this.jsVersion + '.js'),
        this.destinationPath(path.join(basePath, 'Widget.js')),
        this
      );
    }
    
    if (this.hasUIFile) {
      this.fs.copyTpl(
        this.templatePath('_Widget.html'),
        this.destinationPath(path.join(basePath, 'Widget.html')),
        this
      );
    }
    if (this.hasConfig) {
      this.fs.copyTpl(
        this.templatePath('_config.json'),
        this.destinationPath(path.join(basePath, 'config.json')),
        this
      );
    }
    if (this.hasStyle) {
      if(this.useSass) {
        this.fs.copyTpl(
          this.templatePath('css/_style.scss'),
          this.destinationPath(path.join(basePath, 'css/style.scss')),
          this
        );
      } else {
        this.fs.copyTpl(
          this.templatePath('css/_style.css'),
          this.destinationPath(path.join(basePath, 'css/style.css')),
          this
        );
      }

    }
    if (this.hasLocale) {
      this.fs.copyTpl(
        this.templatePath('nls/_strings.js'),
        this.destinationPath(path.join(basePath, 'nls/strings.js')),
        this
      );
    }
    this.fs.copy(
      this.templatePath('images/icon.png'),
      this.destinationPath(path.join(basePath, 'images/icon.png'))
    );

    this.fs.copyTpl(
      this.templatePath('_manifest.json'),
      this.destinationPath(path.join(basePath, 'manifest.json')),
      this
    );

    // Settings:
    if(this.hasSettingPage) {
      if(this.jsVersion === 'ES2015TypeScript') {
        this.fs.copyTpl(
          this.templatePath('setting/_Setting.ts'),
          this.destinationPath(path.join(basePath, 'setting/Setting.ts')),
          this
        );
      } else {
        this.fs.copyTpl(
          this.templatePath('setting/_Setting_' + this.jsVersion + '.js'),
          this.destinationPath(path.join(basePath, 'setting/Setting.js')),
          this
        );
      }
      if (this.hasSettingUIFile) {
        this.fs.copyTpl(
          this.templatePath('setting/_Setting.html'),
          this.destinationPath(path.join(basePath, 'setting/Setting.html')),
          this
        );
      }
      if (this.hasSettingLocale) {
        this.fs.copyTpl(
          this.templatePath('setting/nls/_strings.js'),
          this.destinationPath(path.join(basePath, 'setting/nls/strings.js')),
          this
        );
      }
      if (this.hasSettingStyle) {
        if(this.useSass) {
          this.fs.copyTpl(
            this.templatePath('setting/css/_style.scss'),
            this.destinationPath(path.join(basePath, 'setting/css/style.scss')),
            this
          );
        } else {
          this.fs.copyTpl(
            this.templatePath('setting/css/_style.css'),
            this.destinationPath(path.join(basePath, 'setting/css/style.css')),
            this
          );
        }
      }
    }
  }
};
