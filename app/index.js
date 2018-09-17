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
    return fs.statSync(path.join(srcpath, file)).isDirectory() && file !== 'zips';
  });
}

module.exports = class extends Generator {
  initializing() {
    this.gruntfile = new GruntfileEditor();
  }

  prompting() {
    var done = this.async();
    var self = this;

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the ArcGIS Web AppBuilder generator!'));
    this.log(chalk.yellow('These generators should be run in the root folder of your project.'));

    var prompts = [{
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
      message: 'Type of widget(s) to be generated:'
    }, {
      name: 'wabRoot',
      message: 'Web AppBuilder install root:',
      'default': function(currentAnswers) {
        return path.join(homedir, 'WebAppBuilderForArcGIS');
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
      type: 'confirm',
      message: 'Would you like to use SASS for CSS preprocessing?',
      name: 'useSass'
    }, {
      name: 'jsVersion',
      type: 'list',
      message: 'Which JavaScript  syntax version would you like to develop in?',
      choices: ['ES5', 'ES2015', 'TypeScript']
    }];

    this.prompt(prompts).then(function(props) {
      this.wabRoot = props.wabRoot;
      this.widgetsType = props.widgetsType;
      this.useSass = props.useSass;
      this.jsVersion = props.jsVersion;
      if (props.appDirId && props.appDirId !== 'None') {
        this.appDirId = props.appDirId;
      } else {
        this.appDirId = false;
      }
      done();
    }.bind(this));
  }

  writing() {

      mkdirp('widgets');
      this.config.set('widgetsType', this.widgetsType);
      this.config.set('useSass', this.useSass);
    this.config.set('jsVersion', this.jsVersion);

    // gruntConfig:


      // Setting up the stemappDir and appDir Gruntfile variables:
      var stemappDir;
      if (this.widgetsType === 'is3d') {
        stemappDir = path.join(this.wabRoot, 'client', 'stemapp3d');
      } else {
        stemappDir = path.join(this.wabRoot, 'client', 'stemapp');
      }
      this.appDir = false;
      if (this.appDirId) {
        this.appDir = path.join(this.wabRoot, 'server', 'apps', this.appDirId);
      }
      if (isWin) {
        // this hack is needed to ensure paths are not escaped when injected into Gruntfile
        stemappDir = stemappDir.replace(/\\/g, '/');
        if (this.appDir) {
          this.appDir = this.appDir.replace(/\\/g, '/');
        }
      }
      this.gruntfile.insertVariable('stemappDir', '"' + stemappDir + '"');
      if (this.appDir) {
        this.gruntfile.insertVariable('appDir', '"' + this.appDir + '"');
      } else {
        this.gruntfile.insertVariable('appDir', '"TODO - AFTER CREATING AN APP, PLEASE PUT PATH HERE AND INSERT ENTRY IN SYNC.MAIN.FILES BELOW."');
      }


      // SYNC CONFIG
      var syncConfig = '{ main: { verbose: true, files: [';
      var filesPrefix = '{cwd: \'dist/\', src: \'**\', dest: ';
      syncConfig = syncConfig + filesPrefix + 'stemappDir }';
      if (this.appDir) {
        syncConfig = syncConfig + ',' + filesPrefix + 'appDir }';
      }
      syncConfig = syncConfig + ']';
      syncConfig = syncConfig + '} }';

      this.gruntfile.insertConfig('sync', syncConfig);

    if(this.jsVersion === 'TypeScript') {
      // TS CONFIG
      var tsConfig = {
        default: {
          tsconfig: {
            passThrough: true
          }
        }
      };
      this.gruntfile.insertConfig('ts', JSON.stringify(tsConfig));
    } else {
      // BABEL CONFIG
      var babelConfig = {
        options: {
          sourceMap: true
        },
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
    }

      // WATCH CONFIG
      this.gruntfile.insertConfig('watch', `{
        main: {
          files: ['widgets/**', 'themes/**'],
        tasks: ['clean', ${(this.useSass ? '\'sass\', ' : '')}${(this.jsVersion === 'TypeScript' ? '\'ts\', ' : '\'babel\', ')} 'copy', 'sync'],
          options: {
            spawn: false,
          atBegin: true,
          livereload: true
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
          src: 'dist/*'
        }
      }));

      // SASS CONFIG
      if(this.useSass) {

        // must require in the "sass" variable so it can be used on the "implementation" line below:
        this.gruntfile.prependJavaScript('const sass = require(\'node-sass\');');

        this.gruntfile.insertConfig('sass', `{
          dist: {
            options: {
              implementation: sass,
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
        this.gruntfile.loadNpmTasks('node-sass');
        this.gruntfile.loadNpmTasks('grunt-sass');
      }


      // load tasks
    if(this.jsVersion === 'TypeScript') {
      this.gruntfile.loadNpmTasks('grunt-ts');
    } else {
      this.gruntfile.loadNpmTasks('grunt-babel');
    }
      this.gruntfile.loadNpmTasks('grunt-contrib-clean');
      this.gruntfile.loadNpmTasks('grunt-contrib-copy');
      this.gruntfile.loadNpmTasks('grunt-contrib-watch');
      this.gruntfile.loadNpmTasks('grunt-sync');

      // register tasks
      this.gruntfile.registerTask('default', ['watch']);

    // projectFiles:

      this.fs.copyTpl(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );

    if(this.jsVersion === 'TypeScript') {
      this.fs.copyTpl(
        this.templatePath('tsconfig'),
        this.destinationPath('tsconfig.json')
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc')
      );
    }
      const buildObj = {
        "skip-test": true,
        "skip-main": true,
      }

      if (this.appDir && this.widgetsType !== 'is3d'){
        buildObj.scripts = {
          "build": `esri-wab-build ${this.appDir}`
        };
      }

      this.composeWith(require.resolve('generator-npm-init/app'),buildObj);

      fs.writeFileSync('Gruntfile.js', this.gruntfile.toString());
    }

  install() {
    if (this.options['skip-install']) {
      return;
    }

    // we install different sets of packages depending on TypeScript or not:
    var dependencies = [
      'grunt',
      'grunt-contrib-clean',
      'grunt-contrib-copy',
      'node-sass',
      'grunt-sass@3.0.1',
      'grunt-sync',
      'grunt-contrib-watch',
      'esri-wab-build'
    ];

    if(this.jsVersion === 'TypeScript') {
      dependencies = dependencies.concat([
        'dojo-typings',
        'grunt-contrib-connect',
        'grunt-ts',
        'typescript@2.6.2'
      ]);
      // 3D vs 2D we need to install a different declarations file:
      if (this.widgetsType === 'is3d') {
        dependencies.push('@types/arcgis-js-api@4.6.0');
      } else {
        dependencies.push('@types/arcgis-js-api@3.23.0');
      }
    } else {
      dependencies = dependencies.concat([
      'babel-plugin-transform-es2015-modules-simple-amd',
      'babel-preset-es2015-without-strict',
        'babel-preset-stage-0',
        'grunt-babel',
        'babel-core'
      ]);
    }

    this.npmInstall(dependencies, {
      'saveDev': true
    });
  }
}
