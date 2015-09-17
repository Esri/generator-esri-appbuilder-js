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
    'dojo/_base/array',
    'dojo/on',
    'dojo/aspect',
    'jimu/BaseWidgetPanel',
    'jimu/BaseWidgetFrame',
    'jimu/utils',
    './FoldableDijit',
    './FoldableWidgetFrame'
  ],
  function(
    declare, lang, html, array, on, aspect, BaseWidgetPanel,
    BaseWidgetFrame, utils, FoldableDijit, FoldableWidgetFrame
  ) {
    var borderRadius = '4px';

    /* global jimuConfig */

    return declare([BaseWidgetPanel, FoldableDijit], {
      baseClass: 'jimu-panel jimu-foldable-dijit jimu-foldable-panel',

      closeTolerance: 30,

      openAnimation: 'fadeIn',
      closeAnimation: 'fadeOut',
      animationDuration: 500,

      startup: function() {
        this.titleHeight = 35;
        this.inherited(arguments);

        html.addClass(this.titleNode, 'jimu-panel-title');
        this.createCloseBtn();
        this.createMaxBtn();
        this.createFoldableBtn();
        this.panelManager.normalizePanel(this);
      },

      getPanelPosition: function(){
        if (window.appInfo.isRunInMobile) {
          return this.panelManager.getPositionOnMobile(this);
        } else {
          var pos = lang.clone(this.position);
          if(typeof pos.width === 'undefined'){
            pos.width = 360;
          }
          if(this.windowState === 'minimized'){
            pos.bottom = 'auto';
            pos.height = this.titleHeight;
            pos.borderRadiusStyle = {
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            };
          }else{
            pos.bottom = this.position.bottom;
            pos.height = 'auto';
            pos.borderRadiusStyle = {
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius
            };
          }

          return pos;
        }
      },

      onNormalize: function(){
        this.resize();
      },

      onMaximize: function(){
        this.resize();
      },

      onMinimize: function(){
        this.resize();
      },

      resize: function() {
        this._switchMaxBtn();
        this._switchParentNode();

        var pos = this.getPanelPosition();
        if(this.position.zIndex){
          pos.zIndex = this.position.zIndex;
        }
        var style = utils.getPositionStyle(pos);
        lang.mixin(style, pos.borderRadiusStyle);
        html.setStyle(this.domNode, style);

        if (this.getChildren().length > 1) {
          this._setFrameSize(pos.contentHeight);
        }

        this.inherited(arguments);
      },

      reloadWidget: function(widgetConfig) {
        this.inherited(arguments);
        if (!this.isWidgetInPanel(widgetConfig)) {
          return;
        }
        if (!Array.isArray(this.config.widgets)) {
          this.setTitleLabel(widgetConfig.label);
        }
      },

      updateConfig: function(_config) {
        this.inherited(arguments);
        this.setTitleLabel(_config.label);
      },

      _switchMaxBtn: function(){
        if (window.appInfo.isRunInMobile) {
          html.setStyle(this.maxNode, 'display', '');
        }else{
          html.setStyle(this.maxNode, 'display', 'none');
        }
      },

      _switchParentNode: function(){
        if (window.appInfo.isRunInMobile) {
          html.place(this.domNode, jimuConfig.layoutId);
        }else{
          html.place(this.domNode, this.map.id);
        }
      },

      _setFrameSize: function(contentHeight) {
        var h, openedPaneCount = 0;

        //openedPaneCount should >= 1
        array.forEach(this.getChildren(), function(frame) {
          if (!frame.folded) {
            openedPaneCount++;
          }
        }, this);

        if(typeof contentHeight === 'undefined'){
          contentHeight = html.getContentBox(this.containerNode).h;
        }

        h = (contentHeight - (this.getChildren().length - openedPaneCount) *
          this.getChildren()[0].titleHeight) / openedPaneCount;
        array.forEach(this.getChildren(), function(frame) {
          if (frame.folded) {
            html.setStyle(frame.domNode, {
              height: frame.titleHeight + 'px'
            });
          } else {
            html.setStyle(frame.domNode, {
              height: h + 'px'
            });
          }
          frame.resize();
        }, this);
      },

      createCloseBtn: function() {
        this.closeNode = html.create('div', {
          'class': 'close-btn jimu-float-trailing'
        }, this.titleNode);

        this.own(on(this.closeNode, 'click', lang.hitch(this, function(evt) {
          evt.stopPropagation();
          this.panelManager.closePanel(this);
        })));
      },

      createMaxBtn: function(){
        this.maxNode = html.create('div', {
          'class': 'max-btn jimu-float-trailing'
        }, this.titleNode);

        this.own(on(this.maxNode, 'click', lang.hitch(this, function(evt) {
          evt.stopPropagation();
          this.onMaxNodeClick();
        })));
      },

      createFrame: function(widgetConfig) {
        var frame;
        if (this.config.widgets && this.config.widgets.length === 1 || !this.config.widgets) {
          frame = new BaseWidgetFrame();
        } else {
          frame = new FoldableWidgetFrame({
            label: widgetConfig.label,
            widgetManager: this.widgetManager
          });

          aspect.after(frame, 'onFoldStateChanged', lang.hitch(this, function() {
            var openedPaneCount = 0;

            this._setFrameSize();
            array.forEach(this.getChildren(), function(frame) {
              if (!frame.folded) {
                openedPaneCount++;
              }
            }, this);

            array.forEach(this.getChildren(), function(frame) {
              if (!frame.folded && openedPaneCount === 1) {
                frame.foldEnable = false;
              } else {
                frame.foldEnable = true;
              }
            }, this);
          }));
        }

        return frame;
      },

      onFoldableNodeClick: function() {
        this.inherited(arguments);

        if (this.windowState === 'minimized') {
          this.panelManager.normalizePanel(this);
        } else {
          this.panelManager.minimizePanel(this);
        }
      },

      onMaxNodeClick: function() {
        if (this.windowState === 'maximized') {
          this.panelManager.normalizePanel(this);
        } else {
          this.panelManager.maximizePanel(this);
        }
      },

      moveTitle: function() {
        if (this.isFull) {
          if (this.folded) {
            html.setStyle(this.domNode, {
              top: (html.getMarginBox(jimuConfig.layoutId).h - this.titleHeight) + 'px'
            });
          } else {
            html.setStyle(this.domNode, {
              top: '0px'
            });
          }
        } else {
          html.setStyle(this.domNode, {
            top: this.position.top + 'px'
          });
        }
      }
    });
  });