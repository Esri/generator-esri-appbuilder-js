'use strict';
// var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


module.exports = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    // no dependencies in package.json (yet)
    // this.on('end', function () {
    //   if (!this.options['skip-install']) {
    //     this.installDependencies();
    //   }
    // });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the ArcGIS Web AppBuilder generator!'));
    console.log(chalk.yellow('The generators should be run in the root folder of either the stem app or an app that you\'ve already created with the Web AppBuilder.'));

    var prompts = [{
      name: 'author',
      message: 'Author:',
      'default': 'Your Name or Organization'
    }];

    this.prompt(prompts, function (props) {
      this.author = props.author;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('widgets');

    this.template('_package.json', 'package.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});
