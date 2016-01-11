# generator-esri-appbuilder-js [![Build Status](https://secure.travis-ci.org/Esri/generator-esri-appbuilder-js.png?branch=master)](https://travis-ci.org/Esri/generator-esri-appbuilder-js)

> [Yeoman](http://yeoman.io) generator to help customize [the ArcGIS Web AppBuilder](https://developers.arcgis.com/web-appbuilder/).

## About

This generator scaffolds out the boilerplate files that are needed when you are customizing the Web AppBuilder. This includes [generators](#running-the-generators) to set up your project and scaffold out the files needed to create custom widgets and themes.

![Screenshot](https://raw.githubusercontent.com/Esri/generator-esri-appbuilder-js/master/docs/images/running-the-generators.png)

## Getting Started

### Installation

To install Yeoman from npm (if not already), run:

```bash
$ npm install -g yo
```

To install generator-esri-appbuilder-js from npm, run:

```bash
$ npm install -g generator-esri-appbuilder-js
```

### Running the Generators

The generators should be run in the root of a working folder for your project. This should be *outside* of the Web AppBuilder's folder structure (i.e. NOT in the stem app or an app that you've already created with the Web AppBuilder). The grunt tasks configured by the generators will handle copying the widget and theme files to the appropriate folders under the Web AppBuilder's install directory.

#### App (Default) Generator

The app generator installs and configures the [grunt tasks](#running-the-grunt-tasks) and other project files (`package.json`, `.jshintrc`, etc) and ensures that required subfolders (like `widgets`) exist.

1. Navigate into the root folder of your project
2. Run the generator with `yo esri-appbuilder-js`
3. Answer the man's questions!

|Prompt|Description|Default|
|------|-----------|-------|
|Author|Name of developers or organization for widget manifests|Your Name or Organization
|Web AppBuilder install root|The root folder where you installed (unzipped) the Web AppBuilder Developer Edition[USER_HOME_FOLDER]/arcgis-web-appbuilder-1.3|

#### Widget Generator

Scaffolds out the files needed to create a new custom widget.

1. Navigate into the root folder of your project
2. Run the generator with `yo esri-appbuilder-js:widget`
3. Answer the man's questions!

|Prompt|Description|Default|
|------|-----------|-------|
|Widget Name|Folder name for output files and widget identifier|MyWidget|
|Widget Title|Name users see in widget selector and panel title bar|My Widget|
|Description|What does this widget do? (optional)|A custom Web AppBuilder widget|
|Base Class|The widget's base class|my-widget|
|Run inside a panel|Will your widget run inside a panel?|Yes|
|Locale (i18n) file|Will your widget require a locale file?|Yes|
|Style (CSS) file|Will your widget require a style file?|Yes|
|Config (JSON) file|Will your widget require a configuration file?|Yes|
|Template (HTML) file|Will your widget require a template file?|Yes|
|Would you like a settings page?|Will your widget have a settings page?|Yes
|Settings template (HTML) file|Will your settings page require a template file?|Yes|
|Settings locale (i18n) file|Will your settings page require a locale file?|Yes|
|Settings style (CSS) file|Will your settings page require a style file?|Yes|

Taking the default values for the prompts will generate the following output under the `widgets` folder:

```
MyWidget
│   config.json
│   manifest.json
│   Widget.html
│   Widget.js
│
├───css
│       style.css
│
├───images
│       icon.png
│
├───nls
│       strings.js
│
└───setting
    |   Setting.js
    |   Setting.html
    ├───nls
    |       strings.js
    └───css
            style.css
```

After you [copy the widget files to the Web AppBuilder's stemapp](#copying-widget-and-theme-files), the next time you run the Web AppBuilder, you will see something like the following on the widgets panel:

![Widget in the Builder](https://raw.githubusercontent.com/Esri/generator-esri-appbuilder-js/master/docs/images/widget-in-builder.png)

### Theme Generator

Scaffolds out the files needed to create a new custom theme based on the default Foldable Theme by Esri.

1. Navigate into the root folder of your project
2. Run the generator with `yo esri-appbuilder-js:theme`
3. Answer the man's questions!

|Prompt|Description|Default|
|------|-----------|-------|
|Theme Name|Folder name for output files and theme identifier|DefaultThemeName|
|Description|Give a description of your custom theme|A good description of my theme...|
|Author|Your name or organization to be associated with the theme|My organization

## Copying Widget and Theme Files

In order for the widgets and themes that you're working on to be available in the Web AppBuilder you will need to copy their files to the appropriate folders under the Web AppBuilder's install root.

### Copying the Files Manually

For example, let's say you've installed the Web AppBuilder in `c:\arcgis-web-appbuilder-1.3`, then you'll need to copy widget and theme files to their respective folders under the stem app:

```
c:\arcgis-web-appbuilder-1.3\client\stemapp\widgets
c:\arcgis-web-appbuilder-1.3\client\stemapp\themes
```

Also, you'll likely want to copy widget and theme files to any applications that you've created that use them:

```
c:\arcgis-web-appbuilder-1.3\server\apps\[appId]\widgets
c:\arcgis-web-appbuilder-1.3\server\apps\[appId]\themes
```

Unless you're using the grunt tasks, you'll need to re-copy the files each time you make changes to the files.

### Running the Grunt Tasks

The easiest way to keep your widget and theme files in sync with the Web AppBuilder is to run the grunt tasks. After running the generators, you can run the default grunt task following at the project root:

```
grunt
```

This will copy over any files that haven't already been copied over, and then start watching all files under the widgets and themes folders for changes and re-copy the files to the Web AppBuilder's folders.

## Issues

Find a bug or want to request a new feature?  Please let us know by [submitting an issue](https://github.com/Esri/generator-esri-appbuilder-js/issues).

## Contributing

We welcome contributions from anyone and everyone. Please see Esri's [guidelines for contributing](https://github.com/esri/contributing).

## Credit

This generator was inspired by [@steveoh](https://github.com/steveoh) and [@stdavis](https://github.com/stdavis)'s [generator-dojo-widget](https://github.com/steveoh/generator-dojo-widget) as well as [@dbouwman](https://github.com/dbouwman)'s [generator-bootmap](https://github.com/dbouwman/generator-bootmap).

## Licensing

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](https://raw.githubusercontent.com/Esri/generator-esri-appbuilder-js/master/license.txt) file.

[](Esri Tags: web AppBuilder yeoman generator node)
[](Esri Language: JavaScript)
