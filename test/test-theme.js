/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('esri-appbuilder-js:theme subgenerator', function() {
    beforeEach(function(done) {
        helpers.testDirectory(path.join(__dirname, 'temp'), function(err) {
            if (err) {
                return done(err);
            }

            this.theme = helpers.createGenerator('esri-appbuilder-js:theme', [
                '../../theme'
            ]);
            console.log('cleared folder and created theme generator');
            done();
        }.bind(this));
    });

    describe('when scaffolding theme', function() {

        beforeEach(function(done) {
            helpers.mockPrompt(this.theme, {
                themeName: 'TestTheme',
                desc: 'A test theme.',
                author: 'Test Authorsen'
            });
            this.theme.run({}, function() {
                done();
            });
        });

        it('it creates expected files', function( /*done*/ ) {
            var expected = [
                // add files you expect to exist here.'
                'themes/Testtheme/common.css',
                'themes/Testtheme/layouts/default/config.json',
                'themes/Testtheme/images',
                'themes/Testtheme/layouts',
                'themes/Testtheme/manifest.json',
                'themes/Testtheme/panels',
                'themes/Testtheme/styles',
                'themes/Testtheme/widgets',
                'themes/Testtheme/images/cancel.png',
                'themes/Testtheme/images/close.png',
                'themes/Testtheme/images/double_arrow.png',
                'themes/Testtheme/images/icon.png',
                'themes/Testtheme/layouts/default',
                'themes/Testtheme/layouts/default/icon.png',
                'themes/Testtheme/panels/DockablePanel',
                'themes/Testtheme/panels/FoldablePanel',
                'themes/Testtheme/panels/SimpleBorderPanel',
                'themes/Testtheme/panels/TitlePanel',
                'themes/Testtheme/panels/DockablePanel/images',
                'themes/Testtheme/panels/DockablePanel/Panel.html',
                'themes/Testtheme/panels/DockablePanel/Panel.js',
                'themes/Testtheme/panels/DockablePanel/images/bar_down.png',
                'themes/Testtheme/panels/DockablePanel/images/bar_left.png',
                'themes/Testtheme/panels/DockablePanel/images/bar_right.png',
                'themes/Testtheme/panels/DockablePanel/images/bar_up.png',
                'themes/Testtheme/panels/DockablePanel/images/nav_down.png',
                'themes/Testtheme/panels/DockablePanel/images/nav_left.png',
                'themes/Testtheme/panels/DockablePanel/images/nav_right.png',
                'themes/Testtheme/panels/DockablePanel/images/nav_up.png',
                'themes/Testtheme/panels/FoldablePanel/FoldableDijit.js',
                'themes/Testtheme/panels/FoldablePanel/FoldableWidgetFrame.js',
                'themes/Testtheme/panels/FoldablePanel/Panel.js',
                'themes/Testtheme/panels/SimpleBorderPanel/Panel.js',
                'themes/Testtheme/panels/TitlePanel/Panel.js',
                'themes/Testtheme/styles/black',
                'themes/Testtheme/styles/cyan',
                'themes/Testtheme/styles/default',
                'themes/Testtheme/styles/green',
                'themes/Testtheme/styles/black/style.css',
                'themes/Testtheme/styles/cyan/style.css',
                'themes/Testtheme/styles/default/style.css',
                'themes/Testtheme/styles/green/style.css',
                'themes/Testtheme/widgets/HeaderController',
                'themes/Testtheme/widgets/HeaderController/config.json',
                'themes/Testtheme/widgets/HeaderController/css',
                'themes/Testtheme/widgets/HeaderController/images',
                'themes/Testtheme/widgets/HeaderController/manifest.json',
                'themes/Testtheme/widgets/HeaderController/nls',
                'themes/Testtheme/widgets/HeaderController/PopupTileNodes.js',
                'themes/Testtheme/widgets/HeaderController/setting',
                'themes/Testtheme/widgets/HeaderController/Widget.html',
                'themes/Testtheme/widgets/HeaderController/Widget.js',
                'themes/Testtheme/widgets/HeaderController/css/images',
                'themes/Testtheme/widgets/HeaderController/css/style.css',
                'themes/Testtheme/widgets/HeaderController/css/images/arrow.png',
                'themes/Testtheme/widgets/HeaderController/css/images/close.png',
                'themes/Testtheme/widgets/HeaderController/images/app-logo.png',
                'themes/Testtheme/widgets/HeaderController/images/group_icon.png',
                'themes/Testtheme/widgets/HeaderController/images/icon.png',
                'themes/Testtheme/widgets/HeaderController/images/more_icon.png',
                'themes/Testtheme/widgets/HeaderController/nls/ar',
                'themes/Testtheme/widgets/HeaderController/nls/cs',
                'themes/Testtheme/widgets/HeaderController/nls/da',
                'themes/Testtheme/widgets/HeaderController/nls/de',
                'themes/Testtheme/widgets/HeaderController/nls/es',
                'themes/Testtheme/widgets/HeaderController/nls/et',
                'themes/Testtheme/widgets/HeaderController/nls/fi',
                'themes/Testtheme/widgets/HeaderController/nls/fr',
                'themes/Testtheme/widgets/HeaderController/nls/he',
                'themes/Testtheme/widgets/HeaderController/nls/it',
                'themes/Testtheme/widgets/HeaderController/nls/ja',
                'themes/Testtheme/widgets/HeaderController/nls/ko',
                'themes/Testtheme/widgets/HeaderController/nls/lt',
                'themes/Testtheme/widgets/HeaderController/nls/lv',
                'themes/Testtheme/widgets/HeaderController/nls/nb',
                'themes/Testtheme/widgets/HeaderController/nls/nl',
                'themes/Testtheme/widgets/HeaderController/nls/pl',
                'themes/Testtheme/widgets/HeaderController/nls/pt-BR',
                'themes/Testtheme/widgets/HeaderController/nls/pt-PT',
                'themes/Testtheme/widgets/HeaderController/nls/ro',
                'themes/Testtheme/widgets/HeaderController/nls/ru',
                'themes/Testtheme/widgets/HeaderController/nls/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/sv',
                'themes/Testtheme/widgets/HeaderController/nls/th',
                'themes/Testtheme/widgets/HeaderController/nls/tr',
                'themes/Testtheme/widgets/HeaderController/nls/zh-cn',
                'themes/Testtheme/widgets/HeaderController/nls/ar/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/cs/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/da/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/de/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/es/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/et/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/fi/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/fr/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/he/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/it/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/ja/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/ko/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/lt/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/lv/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/nb/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/nl/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/pl/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/pt-BR/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/pt-PT/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/ro/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/ru/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/sv/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/th/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/tr/strings.js',
                'themes/Testtheme/widgets/HeaderController/nls/zh-cn/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/css',
                'themes/Testtheme/widgets/HeaderController/setting/nls',
                'themes/Testtheme/widgets/HeaderController/setting/Setting.html',
                'themes/Testtheme/widgets/HeaderController/setting/Setting.js',
                'themes/Testtheme/widgets/HeaderController/setting/css/style.css',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ar',
                'themes/Testtheme/widgets/HeaderController/setting/nls/cs',
                'themes/Testtheme/widgets/HeaderController/setting/nls/da',
                'themes/Testtheme/widgets/HeaderController/setting/nls/de',
                'themes/Testtheme/widgets/HeaderController/setting/nls/es',
                'themes/Testtheme/widgets/HeaderController/setting/nls/et',
                'themes/Testtheme/widgets/HeaderController/setting/nls/fi',
                'themes/Testtheme/widgets/HeaderController/setting/nls/fr',
                'themes/Testtheme/widgets/HeaderController/setting/nls/he',
                'themes/Testtheme/widgets/HeaderController/setting/nls/it',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ja',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ko',
                'themes/Testtheme/widgets/HeaderController/setting/nls/lt',
                'themes/Testtheme/widgets/HeaderController/setting/nls/lv',
                'themes/Testtheme/widgets/HeaderController/setting/nls/nb',
                'themes/Testtheme/widgets/HeaderController/setting/nls/nl',
                'themes/Testtheme/widgets/HeaderController/setting/nls/pl',
                'themes/Testtheme/widgets/HeaderController/setting/nls/pt-BR',
                'themes/Testtheme/widgets/HeaderController/setting/nls/pt-PT',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ro',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ru',
                'themes/Testtheme/widgets/HeaderController/setting/nls/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/sv',
                'themes/Testtheme/widgets/HeaderController/setting/nls/th',
                'themes/Testtheme/widgets/HeaderController/setting/nls/tr',
                'themes/Testtheme/widgets/HeaderController/setting/nls/zh-cn',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ar/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/cs/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/da/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/de/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/es/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/et/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/fi/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/fr/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/he/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/it/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ja/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ko/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/lt/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/lv/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/nb/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/nl/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/pl/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/pt-BR/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/pt-PT/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ro/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/ru/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/sv/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/th/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/tr/strings.js',
                'themes/Testtheme/widgets/HeaderController/setting/nls/zh-cn/strings.js'
            ];
            helpers.assertFile(expected);
        });

        it('should set author in manifest.json ', function() {
          helpers.assertFileContent('themes/Testtheme/manifest.json', /"author": "Test Authorsen"/g);
        });

        it('should set themeName in manifest.json ', function() {
          helpers.assertFileContent('themes/Testtheme/manifest.json', /"name": "Testtheme"/g);
        });

        it('should set description in manifest.json ', function() {
          helpers.assertFileContent('themes/Testtheme/manifest.json', /"description": "A test theme."/g);
        });

    });

});