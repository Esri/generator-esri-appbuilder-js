'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var ThemeGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();
    var dasherize = this._.dasherize;

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ArcGIS Web AppBuilder theme generator!'
    ));

    var prompts = [{
      name: 'themeName',
      message: 'What would you like to call your theme?',
      'default': "DefaultThemeName",
      // test for valid folder name
      validate: function(answer) {
        var validFolderNameRegExp = /^[^\\/?%*"":|<>\.\s]+$/;
        return validFolderNameRegExp.test(answer);
      }
    },
    {
      name: 'author',
      message: 'What is your name or the name of your organization?',
      'default': "My organization"
    },
    {
      name : 'desc',
      message: 'Would you like to add a description for your theme?',
      'default': "A good description of my theme..."
    }
    ];

    this.prompt(prompts, function (props) {
      this.themeName = props.themeName.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1).join(' ');
      this.themeNameClean =  this._.classify(this.themeName);
      this.author = props.author;
      this.description = props.desc;
      done();
    }.bind(this));
  },

    app: function () {
      this.dest.mkdir(this.themeName);
    },

    projectfiles: function () {
    // NOTE: this is needed b/c _Widget.html has ES6 style interpolation delimiters
    // see: https://github.com/lodash/lodash/issues/399
    this._.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;
     
      var basePath = path.join('themes', this.themeName);
      //css
      this.src.copy('_common.css', path.join(basePath, 'common.css'));
      //folders
      this.directory('_images', path.join(basePath, 'images'));
      this.directory('_layouts', path.join(basePath, 'layouts'));
      this.directory('_panels', path.join(basePath, 'panels'));
      this.directory('_styles', path.join(basePath, 'styles'));
      this.directory('_widgets', path.join(basePath, 'widgets'));      
      //Dev dependencies
      //this.src.copy('_package.json',this.themeNameClean + '/package.json');
      //this.src.copy('_bower.json',this.themeNameClean + '/bower.json');

      var context = {
        themeName: this.themeName,
        themeNameClean: this.themeNameClean
      };

      this.template('_manifest.json', path.join(basePath, 'manifest.json'), context);
      this.template('_config.json',path.join(basePath,'layouts/default/config.json'),context);
      
    }
});

module.exports = ThemeGenerator;
