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
    'dojo/on',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin'
  ],
  function(declare, lang, html, on, _WidgetBase, _TemplatedMixin) {
    return declare([_WidgetBase, _TemplatedMixin], {
      baseClass: 'jimu-foldable-dijit',
      width: '100%',
      titleHeight: 20,
      content: null, //content is a dijit
      folded: false,
      templateString: '<div>' +
        '<div class="title" data-dojo-attach-point="titleNode">' +
        '<div class="title-label"' +
        'data-dojo-attach-point="titleLabelNode"></div>' + '</div>' +
        '<div class="jimu-panel-content" data-dojo-attach-point="containerNode"></div>' +
        '</div>',

      startup: function() {
        this.inherited(arguments);

        html.setStyle(this.titleNode, {
          width: this.width,
          height: this.titleHeight + 'px'
        });
        html.setStyle(this.containerNode, {
          top: this.titleHeight + 'px'
        });
        html.setStyle(this.titleLabelNode, {
          lineHeight: this.titleHeight + 'px'
        });
        if (this.label) {
          this.setTitleLabel(this.label);
        }
        this.foldEnable = true;

        this.own(on(this.titleNode, 'click', lang.hitch(this, function(){
          this.onFoldableNodeClick();
        })));
      },

      setTitleLabel: function(label) {
        this.label = label;
        this.titleLabelNode.innerHTML = label;
        this.titleLabelNode.title = label;
      },

      createFoldableBtn: function() {
        this.foldableNode = html.create('div', {
          'class': 'foldable-btn jimu-float-trailing'
        }, this.titleNode);

        this.own(on(this.foldableNode, 'click', lang.hitch(this, function(evt){
          evt.stopPropagation();
          this.onFoldableNodeClick();
        })));
      },

      onFoldableNodeClick: function(){
        if(!this.foldEnable){
          return;
        }
        if(this.folded){
          this.folded = false;
          html.removeClass(this.foldableNode, 'folded');
        }else{
          this.folded = true;
          html.addClass(this.foldableNode, 'folded');
        }
        this.onFoldStateChanged();
      },

      onFoldStateChanged: function(){}
    });
  });