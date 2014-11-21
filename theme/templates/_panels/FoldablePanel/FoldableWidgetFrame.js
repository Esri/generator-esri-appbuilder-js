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

define(['dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'jimu/BaseWidgetFrame',
  './FoldableDijit'],
  function(declare, lang, html, BaseWidgetFrame, FoldableDijit){
  return declare([BaseWidgetFrame, FoldableDijit], {
    baseClass: 'jimu-widget-frame jimu-foldable-dijit foldable-widget-frame',

    postCreate: function(){
      this.inherited(arguments);
      this.titleHeight = 30;
      this.createFoldBtn();
      this.foldEnable = true;
    },

    startup: function(){
      this.inherited(arguments);
      this.setTitleLabel(this.label);
    },

    setWidget: function(){
      this.inherited(arguments);
      this.setTitleLabel(this.widget.label);
    },

    onTitleClick: function(){
      if(!this.foldEnable){
        return;
      }
      if(this.folded){
        this.folded = false;
      }else{
        this.folded = true;
      }
      this.onFoldStateChanged();
    },

    createFoldBtn: function(){
      this.foldNode = html.create('div', {
        'class': 'fold-btn'
      }, this.titleNode);
    },

    onFoldStateChanged: function(){
      if(this.folded){
        html.addClass(this.foldNode, 'folded');
        if(this.widget){
          this.widgetManager.minimizeWidget(this.widget);
        }
      }else{
        html.removeClass(this.foldNode, 'folded');
        if(this.widget){
          this.widgetManager.maximizeWidget(this.widget);
        }
      }
    }
  });
});