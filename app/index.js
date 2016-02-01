'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var isWin = process.platform === 'win32';
var homedir = (isWin) ? process.env.HOMEPATH : process.env.HOME;
var fs = require('fs');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

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
    this.log(chalk.yellow('These generators should be run in the root folder of your project.'));

    var prompts = [{
      name: 'author',
      message: 'Author:',
      'default': 'Your Name or Organization'
    }, {
      name: 'wabRoot',
      message: 'Web AppBuilder install root:',
      'default': path.join(homedir, 'arcgis-web-appbuilder-1.3'),
      validate: function(wabPath) {
        // make sure input directory and apps directory is valid and exists.
        var paths = [wabPath, path.join(wabPath, 'server/apps' )];
        try {
          paths.forEach(function(path) {
            fs.accessSync(path, fs.F_OK);
          });
          return true;
        } catch (e) {
          // It isn't accessible
          return 'Invalid path. Please ensure this is a valid path to your WAB root.';
        }
      }
    }, {
      when: function(currentAnswers) {
        var appsPath = path.join(currentAnswers.wabRoot, 'server', 'apps' );
        var appsDirectories = getDirectories(appsPath);
        if (appsDirectories.length > 0) {
          return true;
        } else {
          this.log(chalk.red('You do not have any WAB apps setup yet. After you create an app, please see the Gruntfile for a todo, or run this generator again.'));
        }
      }.bind(this),
      name: 'appDirId',
      type: 'list',
      message: 'Web AppBuilder application:',
      choices: function(currentAnswers) {
        // Always include option for "None"
        var retArray = [{
          name: 'None',
          value: 'None',
          short: 'N'
        }];
        var appsPath = path.join(currentAnswers.wabRoot, 'server', 'apps' );
        var appsDirectories = getDirectories(appsPath);
        appsDirectories.forEach(function(appDirectory) {
          try {
            // get the config file, convert to JSON, and read the title property
            var configPath = path.join(currentAnswers.wabRoot, 'server', 'apps', appDirectory, 'config.json');
            var configJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if(configJson.hasOwnProperty('title') && configJson.title !== '') {
              retArray.push({
                name: configJson.title,
                value: appDirectory,
                short: appDirectory
              });
            } else {
              // does not have title property or is empty. Use the app folder name (number) as the name.
              retArray.push({
                name: appDirectory,
                value: appDirectory,
                short: appDirectory
              });
            }
          } catch (e) {
            // Cannot open the config file. Just use the app folder name (number) as the name
            retArray.push({
              name: appDirectory,
              value: appDirectory,
              short: appDirectory
            });
          }
        });
        return retArray;
      }
    }];

    this.prompt(prompts, function (props) {
      this.author = props.author;
      this.wabRoot = props.wabRoot;
      if (props.appDirId && props.appDirId !== 'None') {
        this.appDirId = props.appDirId;
      } else {
        this.appDirId = false;
      }
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
      var appDir = false;
      if (this.appDirId) {
        appDir = path.join(this.wabRoot, 'server', 'apps', this.appDirId);
      }
      if (isWin) {
        // this hack is needed to ensure paths are not escaped when injected into Gruntfile
        stemappDir = stemappDir.replace(/\\/g, '/');
        if (appDir) {
          appDir = appDir.replace(/\\/g, '/');
        }
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
      syncConfig = syncConfig + filesPrefix + 'stemappDir }';
      if (appDir) {
        syncConfig = syncConfig + ',' + filesPrefix + 'appDir }';
      }
      syncConfig = syncConfig + ']';
      syncConfig = syncConfig + '} }';
      this.gruntfile.insertVariable('stemappDir', '"' + stemappDir + '"');
      if (appDir) {
        this.gruntfile.insertVariable('appDir', '"' + appDir + '"');
      } else {
        this.gruntfile.insertVariable('appDir', '"TODO - AFTER CREATING AN APP, PLEASE PUT PATH HERE AND INSERT ENTRY IN SYNC.MAIN.FILES BELOW."');
      }
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
