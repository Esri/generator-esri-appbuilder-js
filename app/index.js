'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var isWin = process.platform === 'win32';
var homedir = (isWin) ? process.env.HOMEPATH : process.env.HOME;
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    // check for existence of package.json
    try {
      fs.accessSync('./package.json', fs.F_OK);
      this.hasPackageJson = true;
    } catch (e) {
      this.hasPackageJson = false;
    }
  },

  prompting: function () {
    var done = this.async();
    var self = this;

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the ArcGIS Web AppBuilder generator!'));
    console.log(chalk.yellow('These generators should be run in the root folder of your project.'));

    var prompts = [{
      name: 'abort',
      type: 'confirm',
      default: false,
      message: 'No package.json found. Would you like to abort and run npm init first?',
      when: function() {
        return !self.hasPackageJson;
      }
    }, {
      name: 'wabRoot',
      message: 'Web AppBuilder install root:',
      'default': path.join(homedir, 'arcgis-web-appbuilder-1.3'),
      when: function(answers) {
        return !answers.abort;
      }
    }];

    this.prompt(prompts, function (props) {
      this.abort = props.abort;
      this.wabRoot = props.wabRoot;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      if (this.abort) {
        return;
      }
      this.mkdir('widgets');
    },

    gruntConfig: function() {
      if (this.abort) {
        return;
      }
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
      if (this.abort) {
        return;
      }
      this.copy('editorconfig', '.editorconfig');
      this.copy('jshintrc', '.jshintrc');
    }
  },

  install: function() {
    if (this.abort || this.options['skip-install']) {
      return;
    }
    this.npmInstall(['grunt', 'grunt-contrib-watch', 'grunt-sync'], { 'saveDev': true });
  }
});
