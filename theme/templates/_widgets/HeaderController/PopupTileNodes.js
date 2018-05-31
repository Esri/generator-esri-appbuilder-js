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
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/on',
    'dojo/dom-construct',
    'dojo/query',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'jimu/dijit/ViewStack',
    'jimu/utils'
  ],
  function(
    declare, lang, array, html, on, domConstruct,
    query, _WidgetBase, _TemplatedMixin, ViewStack, utils) {
    /* global jimuConfig */
    //label is not visible if node width is less than 80px, and icon should be scaled.
    var NORMAL_MIN_WIDTH = 80,
        NORMAL_WIDTH = 120, //node width should not be larger than this value.
        MIN_MARGIN = 20, //minimux margin between this dom and the map box.
        MIN_NODE_WIDTH = 10, //If node width is less than 10px, the node will not be visible.
        MAX_ROWCOL = 4,
        MIN_ROWCOL = 3;
    //3*3 tile nodes, with a close button
    return declare([_WidgetBase, _TemplatedMixin], {
      baseClass: 'jimu-header-more-popup',
      templateString: '<div><div class="pages" data-dojo-attach-point="pagesNode"></div>' +
        '<div class="points jimu-corner-bottom"><div class="points-inner"' +
        'data-dojo-attach-point="pointsNode"></div></div></div>',
      margin: 4,

      postCreate: function() {
        this.nodes = [];
        this.pages = [];
        this.createCloseBtn();
      },

      startup: function() {
        this.viewStack = new ViewStack({
          views: [],
          viewType: 'dom'
        }, this.pagesNode);
        this.viewStack.startup();
        // this.createPages();
        // if (this.viewStack.views.length > 0) {
        //   this._selectPage(0);
        // }
        this.resize();
      },

      resize: function() {
        var gridParam = this._calculateGridParam(), closeDiv;
        if(gridParam !== null){
          html.setStyle(this.domNode, utils.getPositionStyle(gridParam.position));
          this.nodeWidth = gridParam.cellSize - this.margin;

          if(!this.oldGridParam || this.oldGridParam.rows !== gridParam.rows ||
              this.oldGridParam.cols !== gridParam.cols){
            //grid changed, re-create the pages
            this.clearPages();
            this.createPages(gridParam);
          }

          this.nodes.forEach(lang.hitch(this, function(node, i) {
            this.setItemNodePosition(node, i, gridParam);
          }));

          this.oldGridParam = gridParam;

          closeDiv = query('div.close', this.domNode)[0];
          html.setStyle(closeDiv, {
            width: this.nodeWidth * 0.25 + 'px',
            height: this.nodeWidth * 0.25 + 'px'
          });
        }else{
          this.oldGridParam = null;
          html.setStyle(this.domNode, utils.getPositionStyle({
            left:0,
            top:0,
            width:0,
            height:0,
            zIndex: 111
          }));
          this.nodeWidth = 0;
        }
      },

      setItemNodePosition: function(node, i, gridParam) {
        var ml, mt, imgWidth = 48, fontSize = 16, imgNode, labelNode; //margin-left, margin-top

        if (i % gridParam.cols === 0) {
          ml = 0;
        } else {
          ml = this.margin / 2;
        }

        // If the node is in the first row of each page, margin-top is 0, else margin-top is 2
        if ((i % (gridParam.rows * gridParam.cols)) < gridParam.cols) {
          mt = 0;
        } else {
          mt = this.margin / 2;
        }

        var nodeStyle = {};
        if (typeof this.nodeWidth === "number") {
          nodeStyle.width = this.nodeWidth + 'px';
          nodeStyle.height = this.nodeWidth + 'px';
        }
        if (typeof ml === 'number') {
          if (window.isRTL){
            nodeStyle.marginRight = ml + 'px';
          }else {
            nodeStyle.marginLeft = ml + 'px';
          }
        }
        if (typeof mt === 'number') {
          nodeStyle.marginTop = mt + 'px';
        }

        imgNode = query('img', node)[0];
        if(imgNode){
          if(gridParam.iconScaled){
            imgWidth = imgWidth * (this.nodeWidth / NORMAL_WIDTH);
            html.setStyle(imgNode, {
              width: imgWidth + 'px',
              height: imgWidth + 'px'
            });
          }else{
            html.setStyle(imgNode, {
              width: imgWidth + 'px',
              height: imgWidth + 'px'
            });
          }
        }

        labelNode = query('div.node-label', node)[0];
        if(labelNode){
          if(gridParam.showLabel){
            if(gridParam.iconScaled){
              fontSize = fontSize * (this.nodeWidth / NORMAL_WIDTH);
              html.setStyle(labelNode, {
                'font-size': fontSize + 'px',
                display: 'block'
              });
            }else{
              html.setStyle(labelNode, {
                'font-size': fontSize + 'px',
                display: 'block'
              });
            }
          }else{
            html.setStyle(labelNode, {
              'font-size': fontSize + 'px',
              display: 'none'
            });
          }
        }

        html.setStyle(node, nodeStyle);
      },

      clearPages: function(){
        array.forEach(this.pages, function(page){
          this.viewStack.removeView(page.pageNode);
        }, this);

        domConstruct.empty(this.pointsNode);
        this.pages = [];
        this.nodes = [];
      },

      /**
       * Create node pages based on the gridParam object.
       * @param  {object} gridParam include rows:number, cols:number, cellSize:number,
       * iconScaled:boolean, showLabel:boolean,
       * position:object(left, right, top, bottom, width, height)
       */
      createPages: function(gridParam) {
        var count, pages, p, pageNode, pointNode;
        count = this.items.length;
        pages = Math.ceil(count / (gridParam.rows * gridParam.cols));
        for (p = 0; p < pages; p++) {
          pageNode = domConstruct.create('div', {
            'class': 'page'
          });
          this.createPageItems(p, pageNode, gridParam);
          this.viewStack.addView(pageNode);

          if (pages > 1) {
            pointNode = domConstruct.create('div', {
              'class': 'point'
            }, this.pointsNode);
            this.own(on(pointNode, 'click', lang.hitch(this, this._onPageNodeClick, p)));
          }

          this.pages.push({
            pageNode: pageNode,
            pointNode: pointNode
          });
        }

        if (this.viewStack.views.length > 0) {
          this._selectPage(0);
        }
      },

      _onPageNodeClick: function(p) {
        this._selectPage(p);
      },

      _selectPage: function(p) {
        if (this.pages.length > 1) {
          query('.point', this.domNode).removeClass('point-selected');
          html.addClass(this.pages[p].pointNode, 'point-selected');
        }
        this.viewStack.switchView(this.pages[p].pageNode);
      },

      createPageItems: function(page, pageNode, gridParam) {
        var count, pageSize, i, b, e, empty;
        count = this.items.length;
        pageSize = gridParam.rows * gridParam.cols;
        b = page * pageSize;
        e = (page + 1) * pageSize;
        empty = e - count;
        e = Math.min(e, count);
        for (i = b; i < e; i++) {
          this.createItemNode(i, pageNode);
        }
        for (i = count; i < count + empty; i++) {
          this.createEmptyItemNode(pageNode);
        }
      },

      createItemNode: function(i, pageNode) {
        var node, item;
        item = this.items[i];
        node = domConstruct.create('div', {
          'class': 'icon-node jimu-float-leading',
          title: item.label,
          settingId: item.id
        }, pageNode);

        domConstruct.create('img', {
          'src': item.icon
        }, node);

        domConstruct.create('div', {
          'class': 'node-label',
          'title': item.label,
          'innerHTML': item.label
        }, node);

        node.config = item;

        this.own(on(node, 'click', lang.hitch(this, function() {
          this.onNodeClicked(node);
        })));

        this.nodes.push(node);
      },

      createEmptyItemNode: function(pageNode) {
        var node;
        node = domConstruct.create('div', {
          'class': 'icon-node jimu-float-leading'
        }, pageNode);
        this.nodes.push(node);
        return node;
      },

      createCloseBtn: function() {
        var node;
        node = domConstruct.create('div', {
          'class': 'close'
        }, this.domNode);
        domConstruct.create('div', {
          'class': 'close-inner'
        }, node);

        on(node, 'click', lang.hitch(this, function() {
          this.hide();
        }));

        return node;
      },

      hide: function() {
        html.setStyle(this.domNode, 'display', 'none');
      },

      show: function() {
        html.setStyle(this.domNode, 'display', 'block');
      },

      onNodeClicked: function(node) {
        /* jshint unused: false*/
        this.hide();
      },

      _calculateGridParam: function(){
        var mapBox, minLen, position, rows, cols, cellSize, iconScaled = false,
            showLabel = true;
        mapBox = html.getContentBox(jimuConfig.mapId);
        minLen = Math.min(mapBox.w, mapBox.h) - MIN_MARGIN * 2;

        //calculate node width
        if(minLen >= NORMAL_WIDTH * MIN_ROWCOL){
          cellSize = NORMAL_WIDTH;
        }else{
          cellSize = Math.floor(minLen / MIN_ROWCOL);

          if(cellSize < MIN_NODE_WIDTH){
            return null;
          }

          iconScaled = true;

          if(cellSize < NORMAL_MIN_WIDTH){
            showLabel = false;
          }
        }

        //calculate rows and columns
        rows = Math.floor((mapBox.h - MIN_MARGIN * 2) / cellSize);
        cols = Math.floor((mapBox.w - MIN_MARGIN * 2) / cellSize);
        rows = rows > MAX_ROWCOL ? MAX_ROWCOL : rows;
        cols = cols > MAX_ROWCOL ? MAX_ROWCOL : cols;
        rows = rows < MIN_ROWCOL ? MIN_ROWCOL : rows;
        cols = rows < MIN_ROWCOL ? MIN_ROWCOL : cols;

        //calculate position
        position = {
          top: (mapBox.h - cellSize * rows) / 2,
          bottom: (mapBox.h - cellSize * rows) / 2,
          left: (mapBox.w - cellSize * cols) / 2,
          right: (mapBox.w - cellSize * cols) / 2,
          width: cellSize * cols - this.margin * (cols - 1) / 2,
          height: cellSize * rows - this.margin * (rows - 1) / 2,
          zIndex: 111
        };

        return {
          rows: rows,
          cols: cols,
          cellSize: cellSize,
          iconScaled: iconScaled,
          showLabel: showLabel,
          position: position
        };
      }
    });
  });