'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var WidgetGenerator = yeoman.generators.Base.extend({
  askFor: function () {
    var done = this.async();

    console.log(chalk.green('Welcome to the Esri WebApp Builder widget generator!'));

    var prompts = [{
      name: 'widgetName',
      message: 'Widget Name:',
      'default': 'MyWidget'
    }, {
      name: 'widgetTitle',
      message: 'Widget Title:',
      'default': 'My Widget'
    }, {
      name: 'description',
      message: 'Description:',
      'default': 'A custom WebApp Builder widget.'
    },
    // TODO: checkbox prompt for 2D/3D once the WAB supports 3D
    {
      name: 'cssPrefix',
      message: 'CSS Prefix:',
      'default': 'myapp-'
    }, {
      type: 'confirm',
      name: 'inPanel',
      message: 'Will your widget run inside a panel?',
      'default': true
    }];

    this.prompt(prompts, function (props) {
      this.widgetName = props.widgetName;
      this.widgetTitle = props.widgetTitle;
      this.description = props.description;
      // TODO: get from prompt once the WAB supports 3D
      this.is2d = true;
      this.is3d = false;
      this.baseClass = this._.dasherize(props.cssPrefix + this.widgetName).replace(/^-/,'');
      this.inPanel = props.inPanel;

      done();
    }.bind(this));
  },

  files: function () {
    var basePath = path.join('widgets', this.widgetName);
    this.template('_Widget.js', path.join(basePath, 'Widget.js'));
    this.template('_Widget.html', path.join(basePath, 'Widget.html'));
    this.template('_config.json', path.join(basePath, 'config.json'));
    this.template('css/_style.css', path.join(basePath, 'css/style.css'));
    this.template('nls/_strings.js', path.join(basePath, 'nls/strings.js'));
    this.copy('images/icon.png', path.join(basePath, 'images/icon.png'));
    this.template('_manifest.json', path.join(basePath, 'manifest.json'));
    // TODO: settings
  }
});

module.exports = WidgetGenerator;
