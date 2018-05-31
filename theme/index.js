'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const _ = require('underscore.string');

function copier(copyFunc, basePath, fname, outpath) {
  var dst = path.join(basePath, outpath || _.ltrim(fname, '_'));
  return copyFunc(this.templatePath(fname), this.destinationPath(dst));
}

module.exports = class extends Generator {
  prompting() {
    const done = this.async();

    this.log(chalk.green('Welcome to the ArcGIS Web AppBuilder theme generator!'));

    const prompts = [{
        name: 'themeName',
        message: 'What would you like to call your theme?',
        'default': "DefaultThemeName",
        // test for valid folder name
        validate: function (answer) {
          const validFolderNameRegExp = /^[^\\/?%*"":|<>\.\s]+$/;
          return validFolderNameRegExp.test(answer);
        }
      },
      {
        name: 'author',
        message: 'What is your name or the name of your organization?',
        'default': "My organization"
      },
      {
        name: 'desc',
        message: 'Would you like to add a description for your theme?',
        'default': "A good description of my theme..."
      }
    ];

    this.prompt(prompts).then(function (props) {
      this.themeNameClean = _.classify(props.themeName);
      this.themeName = props.themeName.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(' ');
      this.author = props.author;
      this.description = props.desc;
      done();
    }.bind(this));
  }

  writing() {
    const basePath = path.join('themes', this.themeNameClean);

    const copyToBasePath = copier.bind(this, this.fs.copy, basePath);
    copyToBasePath('_common.css');
    copyToBasePath('_images');
    copyToBasePath('_layouts');
    copyToBasePath('_panels');
    copyToBasePath('_styles');
    copyToBasePath('_widgets');

    const copyTplToBasePath = copier.bind(this, this.fs.copyTpl, basePath);
    copyTplToBasePath('_manifest.json');
    copyTplToBasePath('_config.json', 'layouts/default/config.json');
  }
};
