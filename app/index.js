'use strict';
// var util = require('util');
// var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var EsriWebappBuilderGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the generator for Esri Webapp Builder!'));
    console.log(chalk.yellow('This generator should be run in the stemapp root folder.'));

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
    this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = EsriWebappBuilderGenerator;
