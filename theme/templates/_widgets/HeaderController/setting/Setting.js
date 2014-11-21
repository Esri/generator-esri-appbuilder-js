///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dojo/_base/html',
    'jimu/BaseWidgetSetting',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/dijit/SimpleTable',
    'dijit/form/Button',
    'dijit/form/ValidationTextBox'
  ],
  function(
    declare, html,
    BaseWidgetSetting,
    _WidgetsInTemplateMixin,
    Table) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-headercontroller-setting',
      openAll: "openAll",
      dropDown: "dropDown",

      startup: function() {
        this.inherited(arguments);
        if (!this.config.groupSetting) {
          this.config.groupSetting = [];
        }

        var fields = [{
          name: 'group',
          title: this.nls.group,
          type: 'text'
        }, {
          name: 'openAll',
          title: this.nls.openAll,
          type: 'radio',
          radio: 'row'
        }, {
          name: 'dropDown',
          title: this.nls.dropDown,
          type: 'radio',
          radio: 'row'
        }];
        var args = {
          fields: fields,
          selectable: false
        };
        this.displayFieldsTable = new Table(args);
        this.displayFieldsTable.placeAt(this.tableInfo);
        this.displayFieldsTable.startup();
        this.setConfig(this.config);
      },

      setConfig: function(config) {
        this.config = config;
        this.displayFieldsTable.clear();
        if(this.appConfig.widgetPool.groups === undefined || this.appConfig.widgetPool.groups.length === 0){
          html.setStyle(this.noGroupTip, 'display', 'block');
          html.setStyle(this.tableInfo, 'display', 'none');
        }else{
          html.setStyle(this.noGroupTip, 'display', 'none');
          html.setStyle(this.tableInfo, 'display', 'block');
          var len = this.appConfig.widgetPool.groups.length;
          for (var i = 0; i < len; i++) {
            var json = {};
            json.group = this.appConfig.widgetPool.groups[i].label;
            json.openAll = this.isOpenAll(config, json.group);
            json.dropDown = !this.isOpenAll(config, json.group);
            this.displayFieldsTable.addRow(json);
          }
        }
      },

      isOpenAll: function(config, label) {
        var len = config.groupSetting.length;
        for (var i = 0; i < len; i++) {
          if (config.groupSetting[i].label === label) {
            if (config.groupSetting[i].type === this.openAll) {
              return true;
            } else {
              return false;
            }
          }
        }
        return true;
      },

      getConfig: function() {
        var data = this.displayFieldsTable.getData();
        var json = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
          var g = {};
          g.label = data[i].group;
          if (data[i].openAll) {
            g.type = this.openAll;
          } else {
            g.type = this.dropDown;
          }
          json.push(g);
        }
        this.config.groupSetting = json;
        return this.config;
      }


    });
  });