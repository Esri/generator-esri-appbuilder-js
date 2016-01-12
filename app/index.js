'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var isWin = process.platform === 'win32';
var homedir = (isWin) ? process.env.HOMEPATH : process.env.HOME;

module.exports = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          bower: false
        });
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the ArcGIS Web AppBuilder generator!'));
    console.log(chalk.yellow('These generators should be run in the root folder of your project.'));

    var prompts = [{
      name: 'author',
      message: 'Author:',
      'default': 'Your Name or Organization'
    }, {
      name: 'wabRoot',
      message: 'Web AppBuilder install root:',
      'default': path.join(homedir, 'arcgis-web-appbuilder-1.3')
    }];

    this.prompt(prompts, function (props) {
      this.author = props.author;
      this.wabRoot = props.wabRoot;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.mkdir('widgets');

      this.template('_package.json', 'package.json');
    },

    gruntConfig: function() {
      var stemappDir = path.join(this.wabRoot, 'client', 'stemapp');
      var appDir = path.join(this.wabRoot, 'server', 'apps', '2');
      if (isWin) {
        // this hack is neded to ensure paths are not esacped when injected into Gruntfile
        stemappDir = stemappDir.replace(/\\/g, '/');
        appDir = appDir.replace(/\\/g, '/');
      }
      var watchConfig = {
        main: {
          files: ['widgets/**'],
          tasks: ['sync'],
          options: {
            spawn: false
          }
        }
      };
      var filesPrefix = '{src: [\'widgets/**\'], dest: ';
      var syncConfig = '{ main: { verbose: true, files: [';
      syncConfig = syncConfig + filesPrefix + 'stemappDir },';
      syncConfig = syncConfig + filesPrefix + 'appDir }]';
      syncConfig = syncConfig + '} }';
      this.gruntfile.insertVariable('stemappDir', '"' + stemappDir + '"');
      this.gruntfile.insertVariable('appDir', '"' + appDir + '"');
      this.gruntfile.insertConfig('watch', JSON.stringify(watchConfig));
      this.gruntfile.insertConfig('sync', syncConfig);
      this.gruntfile.loadNpmTasks('grunt-contrib-watch');
      this.gruntfile.loadNpmTasks('grunt-sync');
      this.gruntfile.registerTask('default', ['sync', 'watch']);
    },

    projectfiles: function () {
      this.copy('editorconfig', '.editorconfig');
      this.copy('jshintrc', '.jshintrc');
    }
  }
});
