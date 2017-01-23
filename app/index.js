'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');
const isWin = process.platform === 'win32';
const homedir = (isWin) ? process.env.HOMEPATH : process.env.HOME;
const fs = require('fs');
const mkdirp = require('mkdirp');
const GruntfileEditor = require('gruntfile-editor');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

module.exports = Generator.extend({
  initializing: function() {
    this.gruntfile = new GruntfileEditor();
    // check for existence of package.json
    try {
      fs.accessSync('./package.json', fs.F_OK);
      this.hasPackageJson = true;
    } catch (e) {
      this.hasPackageJson = false;
    }
  },

  prompting: function() {
    var done = this.async();
    var self = this;

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the ArcGIS Web AppBuilder generator!'));
    this.log(chalk.yellow('These generators should be run in the root folder of your project.'));

    var prompts = [{
      name: 'abort',
      type: 'confirm',
      default: true,
      message: 'No package.json found. Would you like to abort and run npm init first?',
      when: function() {
        return !self.hasPackageJson;
      }
    }, {
      type: 'list',
      choices: [
        {
        value: 'is2d',
        name: '2D'
        },
        {
        value: 'is3d',
        name: '3D'
        }
      ],
      name: 'widgetsType',
      message: 'Type of widget(s) to be generated:',
      when: function(currentAnswers) {
        return !currentAnswers.abort;
      }
    }, {
      when: function(currentAnswers) {
        return !currentAnswers.abort;
      },
      name: 'wabRoot',
      message: 'Web AppBuilder install root:',
      'default': function(currentAnswers) {
        var wabDir;
        if (currentAnswers.widgetsType === 'is3d') {
          wabDir = path.join(homedir, 'WebAppBuilderForArcGIS');
        } else {
          wabDir = path.join(homedir, 'arcgis-web-appbuilder-1.3');
        }
        return wabDir;
      },
      validate: function(wabPath) {
        // make sure input directory and the following paths exist:
        // * server
        // * client
        var paths = [wabPath, path.join(wabPath, 'server'), path.join(wabPath, 'client')];
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
        if (currentAnswers.abort) {
          return false;
        }
        try {
          var appsPath = path.join(currentAnswers.wabRoot, 'server', 'apps');
          var appsDirectories = getDirectories(appsPath);
          if (appsDirectories.length > 0) {
            return true;
          } else {
            this.log(chalk.red('You do not have any WAB apps setup yet. After you create an app, please see the Gruntfile for a todo, or run this generator again.'));
          }
        } catch (e) {
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
        var appsPath = path.join(currentAnswers.wabRoot, 'server', 'apps');
        var appsDirectories = getDirectories(appsPath);
        appsDirectories.forEach(function(appDirectory) {
          try {
            // get the config file, convert to JSON, and read the title property
            var configPath = path.join(currentAnswers.wabRoot, 'server', 'apps', appDirectory, 'config.json');
            var configJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (configJson.hasOwnProperty('title') && configJson.title !== '') {
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
    }, {
      when: function(currentAnswers) {
        return !currentAnswers.abort;
      },
      type: 'confirm',
      message: 'Would you like to use the SASS for CSS preprocessing?',
      name: 'useSass'
    }];

    this.prompt(prompts).then(function(props) {
      this.abort = props.abort;
      this.wabRoot = props.wabRoot;
      this.widgetsType = props.widgetsType;
      this.useSass = props.useSass;
      if (props.appDirId && props.appDirId !== 'None') {
        this.appDirId = props.appDirId;
      } else {
        this.appDirId = false;
      }
      done();
    }.bind(this));
  },

  writing: {
    app: function() {
      if (this.abort) {
        return;
      }
      mkdirp('widgets');
      this.config.set('widgetsType', this.widgetsType);
      this.config.set('useSass', this.useSass);
    },

    gruntConfig: function() {
      if (this.abort) {
        return;
      }

      // Setting up the stemappDir and appDir Gruntfile variables:
      var stemappDir;
      if (this.widgetsType === 'is3d') {
        stemappDir = path.join(this.wabRoot, 'client', 'stemapp3d');
      } else {
        stemappDir = path.join(this.wabRoot, 'client', 'stemapp');
      }
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
      this.gruntfile.insertVariable('stemappDir', '"' + stemappDir + '"');
      if (appDir) {
        this.gruntfile.insertVariable('appDir', '"' + appDir + '"');
      } else {
        this.gruntfile.insertVariable('appDir', '"TODO - AFTER CREATING AN APP, PLEASE PUT PATH HERE AND INSERT ENTRY IN SYNC.MAIN.FILES BELOW."');
      }


      // SYNC CONFIG
      var syncConfig = '{ main: { verbose: true, files: [';
      var filesPrefix = '{cwd: \'dist/\', src: \'**\', dest: ';
      syncConfig = syncConfig + filesPrefix + 'stemappDir }';
      if (appDir) {
        syncConfig = syncConfig + ',' + filesPrefix + 'appDir }';
      }
      syncConfig = syncConfig + ']';
      syncConfig = syncConfig + '} }';

      this.gruntfile.insertConfig('sync', syncConfig);

      // BABEL CONFIG
      var babelConfig = {
        main: {
          files: [{
            expand: true,
            src: [
                'widgets/*.js',
				'widgets/**/*.js',
				'widgets/**/**/*.js',
				'widgets/!**/**/nls/*.js',
				'themes/*.js',
				'themes/**/*.js',
				'themes/**/**/*.js',
				'themes/!**/**/nls/*.js'
            ],
            dest: 'dist/'
          }]
        }
      };
      this.gruntfile.insertConfig('babel', JSON.stringify(babelConfig));

      // WATCH CONFIG
      this.gruntfile.insertConfig('watch', `{
        main: {
          files: ['widgets/**', 'themes/**'],
          tasks: ['clean', ${(this.useSass ? '\'sass\', ' : '')}'babel', 'copy', 'sync'],
          options: {
            spawn: false,
            atBegin: true
          }
        }
      }`);

      // COPY CONFIG
      this.gruntfile.insertConfig('copy', JSON.stringify({
        main: {
          src: [
            'widgets/**/**.html',
            'widgets/**/**.json',
            'widgets/**/**.css',
            'widgets/**/images/**',
            'widgets/**/nls/**',
			'themes/**/**.html',
			'themes/**/**.json',
			'themes/**/**.css',
			'themes/**/images/**',
			'themes/**/nls/**'
          ],
          dest: 'dist/',
          expand: true
        }
      }));

      // CLEAN CONFIG
      this.gruntfile.insertConfig('clean', JSON.stringify({
        dist: {
          src: 'dist/**'
        }
      }));

      // SASS CONFIG
      if(this.useSass) {
        this.gruntfile.insertConfig('sass', `{
          dist: {
            options: {
              sourceMap: true,
            },

            files: [{
              expand: true,
              src: ['widgets/**/*.scss'],
              rename: function(dest, src) {
                return src.replace('scss', 'css')
              }
            }]
          }
        }`);
        this.gruntfile.loadNpmTasks('grunt-sass');
      }


      // load tasks
      this.gruntfile.loadNpmTasks('grunt-babel');
      this.gruntfile.loadNpmTasks('grunt-contrib-clean');
      this.gruntfile.loadNpmTasks('grunt-contrib-copy');
      this.gruntfile.loadNpmTasks('grunt-contrib-watch');
      this.gruntfile.loadNpmTasks('grunt-sync');

      // register tasks
      this.gruntfile.registerTask('default', ['watch']);
    },

    projectfiles: function() {
      if (this.abort) {
        return;
      }
      this.fs.copyTpl(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copyTpl(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc')
      );
      fs.writeFileSync('Gruntfile.js', this.gruntfile.toString());
    }
  },

  install: function() {
    if (this.abort || this.options['skip-install']) {
      return;
    }
    this.npmInstall([
      'babel-plugin-transform-es2015-modules-simple-amd',
      'babel-preset-es2015-without-strict',
      'babel-preset-stage-0',
      'grunt',
      'grunt-contrib-watch',
      'grunt-sync',
      'grunt-babel',
      'grunt-contrib-clean',
      'grunt-contrib-copy',
      'grunt-sass'
    ], {
      'saveDev': true
    });
  }
});
