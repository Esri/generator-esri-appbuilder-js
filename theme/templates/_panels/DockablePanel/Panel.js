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
    'dojo/topic',
    'dijit/_TemplatedMixin',
    'dojo/text!./Panel.html',
    'jimu/BaseWidgetPanel',
    'jimu/dijit/LoadingIndicator',
    'jimu/utils',
    'require'
  ],
  function(
    declare, lang, html, topic,
    _TemplatedMixin, template, BaseWidgetPanel, LoadingIndicator, utils, require
  ) {

    return declare([BaseWidgetPanel, _TemplatedMixin], {
      baseClass: 'jimu-panel jimu-dockable-panel',

      templateString: template,

      //displayNumber: number
      //  the max number of widgets that the panel display at the same time.
      //  Each widget will occupy 1/displayNumber of the panel widget/height.
      //  If the widgets count is larger then this number,
      // there will be a navigation bar displayed to scroll the widget.
      displayNumber: 3,

      //firstIndex: number
      //  the first displayed widget index
      firstIndex: 0,

      //region: String
      //  can be: left, right, bottom, top.
      region: '',

      //resizeMap: Boolean
      //  if true, when resize the panel,
      // the panel will resize map to make sure the panel will not override the map.
      //  Please note that when the panel resize the map,
      // make sure that there is no other element between the panel and the map
      resizeMap: true,

      _barSize: 30,
      _margin: 15,
      _navSize: 25,
      _padding: 15,

      postCreate: function() {
      },

      startup: function() {
        html.setStyle(this.domNode, utils.getPositionStyle(this.position));
        this.loadDisplayWidgets();
        this._setPanelPadding();
        this._setBarPosition();
        this._setNavPosition();
        this.resize();
        this._switchNavStatus();
        this.panelManager.normalizePanel(this);
      },

      resize: function() {
        this._setFrameSize();
      },

      _setFrameSize: function() {
        var count = Math.min(this.displayNumber, this._getConfigs().length);
        if (count === 0) {
          return;
        }
        var dim = {},
          box = html.getContentBox(this.containerNode);
        if (this.region === 'left' || this.region === 'right') {
          dim.width = '100%';
          dim.height = (box.h - count * this._margin) / count + 'px';
          dim.marginTop = this._margin + 'px';
        } else if (this.region === 'top' || this.region === 'bottom') {
          dim.height = '100%';
          dim.width = (box.w - count * this._margin) / count + 'px';
          dim.marginLeft = this._margin + 'px';
        }

        this.getChildren().forEach(lang.hitch(this, function(frame) {
          html.setStyle(frame.domNode, dim);
          frame.resize();
        }));
      },

      loadDisplayWidgets: function() {
        var configs = this._getConfigs();

        function onWidgetLoaded(frame, loading, widget) {
          loading.destroy();
          frame.setWidget(widget);
          widget.startup();
          // if(widgetConfig.defaultState){
          //   this.widgetManager.changeWindowStateTo(widget, widgetConfig.defaultState);
          // }
        }

        var endIndex = this._getEndIndex();
        for (var i = this.firstIndex; i < endIndex; i++) {
          var widgetConfig = configs[i];
          var frame, loading;

          if (this.widgetManager.getWidgetById(widgetConfig.id)) {
            continue;
          }
          loading = new LoadingIndicator();
          frame = this.createFrame(widgetConfig);
          this.addChild(frame);
          html.place(loading.domNode, frame.containerNode);

          this.widgetManager.loadWidget(widgetConfig)
            .then(lang.hitch(this, onWidgetLoaded, frame, loading));
        }
        this._setFrameFloat();
        this._setFrameSize();
      },

      onNormalize: function() {
        html.addClass(this.barNode, 'max');
        html.removeClass(this.barNode, 'min');

        this._setBarPosition();

        if (this.region === 'left') {
          html.setStyle(this.barNode, {
            backgroundImage: 'url(' + require.toUrl('.') + '/images/bar_left.png)'
          });
          html.setStyle(this.domNode, {
            left: 0,
            width: this.position.width + 'px'
          });

          html.setStyle(this.barNode, {
            borderTopLeftRadius: 0,
            borderTopRightRadius: '4px',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: '4px'
          });

        } else if (this.region === 'right') {
          html.setStyle(this.barNode, {
            backgroundImage: 'url(' + require.toUrl('.') + '/images/bar_right.png)'
          });
          html.setStyle(this.domNode, {
            right: 0,
            width: this.position.width + 'px'
          });

          html.setStyle(this.barNode, {
            borderTopLeftRadius: '4px',
            borderTopRightRadius: 0,
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: 0
          });
        } else if (this.region === 'top') {
          html.setStyle(this.barNode, {
            backgroundImage: 'url(' + require.toUrl('.') + '/images/bar_up.png)'
          });
          html.setStyle(this.domNode, {
            top: 0,
            height: this.position.height + 'px'
          });

          html.setStyle(this.barNode, {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px'
          });
        } else if (this.region === 'bottom') {
          html.setStyle(this.barNode, {
            backgroundImage: 'url(' + require.toUrl('.') + '/images/bar_down.png)'
          });
          html.setStyle(this.domNode, {
            bottom: 0,
            height: this.position.height + 'px'
          });

          html.setStyle(this.barNode, {
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          });
        }
        this.inherited(arguments);
      },

      onMinimize: function() {
        html.setStyle(this.barNode, {
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px'
        });

        html.removeClass(this.barNode, 'max');
        html.addClass(this.barNode, 'min');
        this._setBarPosition();

        //on minimize, we can't set width/height = 0 to minimize because we use border-box model
        //and the content height/width can't be nagative
        //go here for more information: http://dev.w3.org/csswg/css-ui/#box-sizing
        if (this.region === 'left') {
          html.setStyle(this.barNode, {
            backgroundImage: 'url(' + require.toUrl('.') + '/images/bar_right.png)'
          });
          html.setStyle(this.domNode, {
            left: (0 - this.position.width) + 'px',
            right: 'auto'
          });
        } else if (this.region === 'right') {
          html.setStyle(this.barNode, {
            backgroundImage: 'url(' + require.toUrl('.') + '/images/bar_left.png)'
          });
          html.setStyle(this.domNode, {
            right: (0 - this.position.width) + 'px',
            left: 'auto'
          });
        } else if (this.region === 'top') {
          html.setStyle(this.barNode, {
            backgroundImage: 'url(' + require.toUrl('.') + '/images/bar_down.png)'
          });
          html.setStyle(this.domNode, {
            top: (0 - this.position.height) + 'px',
            bottom: 'auto'
          });
        } else if (this.region === 'bottom') {
          html.setStyle(this.barNode, {
            backgroundImage: 'url(' + require.toUrl('.') + '/images/bar_up.png)'
          });
          html.setStyle(this.domNode, {
            bottom: (0 - this.position.height) + 'px',
            top: 'auto'
          });
        }
        this.inherited(arguments);
      },

      scrollWidget: function() {
        var endIndex = this._getEndIndex();
        this.getChildren().forEach(lang.hitch(this, function(frame, i) {
          if (i >= this.firstIndex && i < endIndex) {
            html.setStyle(frame.domNode, 'display', '');
          } else {
            html.setStyle(frame.domNode, 'display', 'none');
          }
        }));
      },

      _onBarClick: function() {
        var mapPosition = {};
        if (this.windowState === 'normal') {
          this.panelManager.minimizePanel(this);

          if (this.resizeMap) {
            if (this.region === 'left') {
              mapPosition.left = 0;
            } else if (this.region === 'right') {
              mapPosition.right = 0;
            } else if (this.region === 'top') {
              mapPosition.top = 0;
            } else if (this.region === 'bottom') {
              mapPosition.bottom = 0;
            }

            topic.publish('changeMapPosition', mapPosition);
          }

        } else {
          this.panelManager.normalizePanel(this);

          if (this.resizeMap) {
            if (this.region === 'left') {
              mapPosition.left = this.position.width;
            } else if (this.region === 'right') {
              mapPosition.right = this.position.width;
            } else if (this.region === 'top') {
              mapPosition.top = this.position.height;
            } else if (this.region === 'bottom') {
              mapPosition.bottom = this.position.height;
            }
            topic.publish('changeMapPosition', mapPosition);
          }
        }
      },

      _onPreClick: function() {
        if (this.firstIndex === 0) {
          return;
        }
        this.firstIndex = this.firstIndex - 1;
        this.loadDisplayWidgets();
        this.scrollWidget();
        this._switchNavStatus();
      },

      _onNextClick: function() {
        if (this.firstIndex + this.displayNumber >= this._getConfigs().length) {
          return;
        }
        this.firstIndex = this.firstIndex + 1;
        this.loadDisplayWidgets();
        this.scrollWidget();
        this._switchNavStatus();
      },

      _switchNavStatus: function() {
        if (this.firstIndex === 0) {
          html.setStyle(this.preNode, 'opacity', '0.4');
        } else {
          html.setStyle(this.preNode, 'opacity', '1');
        }

        if (this.firstIndex + this.displayNumber >= this._getConfigs().length) {
          html.setStyle(this.nextNode, 'opacity', '0.4');
        } else {
          html.setStyle(this.nextNode, 'opacity', '1');
        }
      },

      _getEndIndex: function() {
        var configs = this._getConfigs();
        var endIndex = Math.min(this.firstIndex + this.displayNumber, configs.length);
        return endIndex;
      },

      _setBarPosition: function() {
        html.setStyle(this.barNode, {
          position: 'absolute',
          width: this._barSize + 'px',
          height: this._barSize + 'px'
        });

        var pos = this.windowState === 'normal' ?
          (0 - this._barSize) + 'px' : (0 - this._barSize - 2) + 'px';
        if (this.region === 'left') {
          html.setStyle(this.barNode, {
            top: '10px',
            right: pos
          });
        } else if (this.region === 'right') {
          html.setStyle(this.barNode, {
            top: '10px',
            left: pos
          });
        } else if (this.region === 'top') {
          html.setStyle(this.barNode, {
            left: '10px',
            bottom: pos
          });
        } else if (this.region === 'bottom') {
          html.setStyle(this.barNode, {
            left: '10px',
            top: pos
          });
        }
      },

      _setNavPosition: function() {
        var box = html.getMarginBox(this.domNode);

        html.setStyle(this.preNode, {
          position: 'absolute'
        });
        html.setStyle(this.nextNode, {
          position: 'absolute'
        });

        if (this.region === 'left' || this.region === 'right') {
          html.setStyle(this.preNode, {
            top: '10px',
            left: (box.w / 2) + 'px',
            backgroundImage: 'url(' + require.toUrl('.') + '/images/nav_up.png)'
          });

          html.setStyle(this.nextNode, {
            bottom: '10px',
            left: (box.w / 2) + 'px',
            backgroundImage: 'url(' + require.toUrl('.') + '/images/nav_down.png)'
          });
        } else if (this.region === 'top' || this.region === 'bottom') {
          html.setStyle(this.preNode, {
            left: '10px',
            top: (box.h / 2) + 'px',
            backgroundImage: 'url(' + require.toUrl('.') + '/images/nav_left.png)'
          });

          html.setStyle(this.nextNode, {
            right: '10px',
            top: (box.h / 2) + 'px',
            backgroundImage: 'url(' + require.toUrl('.') + '/images/nav_right.png)'
          });
        }
      },

      _setFrameFloat: function() {
        if (this.region === 'top' || this.region === 'bottom') {
          this.getChildren().forEach(function(frame) {
            html.setStyle(frame.domNode, 'float', 'left');
          });
        }
      },

      _setPanelPadding: function() {
        if (this.region === 'left' || this.region === 'right') {
          //padding top is less then padding bottom, because the first element has margin
          html.setStyle(this.domNode, {
            paddingTop: (this._navSize + this._padding - this._margin) + 'px',
            paddingRight: this._padding + 'px',
            paddingBottom: (this._navSize + this._padding) + 'px',
            paddingLeft: this._padding + 'px'
          });
        } else if (this.region === 'top' || this.region === 'bottom') {
          html.setStyle(this.domNode, {
            paddingTop: this._padding + 'px',
            paddingRight: (this._navSize + this._padding) + 'px',
            paddingBottom: this._padding + 'px',
            paddingLeft: (this._navSize + this._padding - this._margin) + 'px'
          });
        }
      },

      _getConfigs: function() {
        var configs = [];
        if (Array.isArray(this.config.widgets)) {
          //it's group
          configs = this.config.widgets;
        } else {
          configs = [this.config];
        }
        return configs;
      }
    });
  });