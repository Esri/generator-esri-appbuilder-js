# generator-esri-appbuilder-js [![Build Status](https://secure.travis-ci.org/Esri/generator-esri-appbuilder-js.png?branch=master)](https://travis-ci.org/Esri/generator-esri-appbuilder-js)

> [Yeoman](http://yeoman.io) generator to help customize [the ArcGIS Web AppBuilder](https://developers.arcgis.com/web-appbuilder/).

## About

This generator scaffolds out the boilerplate files that are needed when you are customizing the Web AppBuilder. This includes [generators](#running-the-generators) to creates project files (`package.json`, `.jshintrc`, etc) and scaffold out the files needed to create a new custom widget and custom theme.

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

The generators should be run in the root folder of either the stem app or an app that you've already created with the Web AppBuilder.

#### App (Default) Generator

Currently the app generator doesn't do much other than install some project files (`package.json`, `.jshintrc`, etc) and ensure required subfolders (like `widgets`) exist. The subgenerators do most of the work.

1. Navigate into either `stemapp` or `server/apps/[appId]` under your local Web AppBuilder installation
2. Run the generator with `yo esri-appbuilder-js`
3. Answer the man's questions!

|Prompt|Description|Default|
|------|-----------|-------|
|Author|Name of developers or organization for widget manifests|Your Name or Organization|

#### Widget Generator

Scaffolds out the files needed to create a new custom widget.

1. Navigate into either `stemapp` or `server/apps/[appId]` under your local Web AppBuilder installation
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
└───nls
        strings.js
```

The next time you run the Web AppBuilder, you will see something like the following on the widgets panel:

![Widget in the Builder](https://raw.githubusercontent.com/Esri/generator-esri-appbuilder-js/master/docs/images/widget-in-builder.png)

### Theme Generator

Scaffolds out the files needed to create a new custom theme based on the default Foldable Theme by Esri.

1. Navigate into either `stemapp` or `server/apps/[appId]` under your local Web AppBuilder installation
2. Run the generator with `yo esri-appbuilder-js:theme`
3. Answer the man's questions!

|Prompt|Description|Default|
|------|-----------|-------|
|Theme Name|Folder name for output files and theme identifier|DefaultThemeName|
|Description|Give a description of your custom theme|A good description of my theme...|
|Author|Your name or organization to be associated with the theme|My organization|

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
