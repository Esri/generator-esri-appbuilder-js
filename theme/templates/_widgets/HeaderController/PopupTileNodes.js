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
    'dojo/_base/html',
    'dojo/on',
    'dojo/dom-construct',
    'dojo/mouse',
    'dojo/query',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'jimu/utils',
    'jimu/dijit/ViewStack'
  ],
  function(declare, lang, html, on, domConstruct, mouse, query, _WidgetBase, _TemplatedMixin, utils, ViewStack) {
    //3*3 tile nodes, with a close button
    return declare([_WidgetBase, _TemplatedMixin], {
      baseClass: 'jimu-header-more-popup',
      templateString: '<div><div class="pages" data-dojo-attach-point="pagesNode"></div>' +
        '<div class="points"><div class="points-inner" data-dojo-attach-point="pointsNode"></div></div></div>',
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
        this.createPages();
        if (this.viewStack.views.length > 0) {
          this._selectPage(0);
        }
        this.resize();
      },

      resize: function() {
        var box;
        box = html.getMarginBox(this.domNode);
        this.nodeWidth = (box.w - this.margin * 2) / 3;

        this.nodes.forEach(lang.hitch(this, function(node, i) {
          this.setItemNodePosition(node, i);
        }));
      },

      setItemNodePosition: function(node, i) {
        var ml, mt;
        i++;
        if (i % 3 === 1) {
          ml = 0;
        } else {
          ml = 2;
        }

        if (i <= 3) {
          mt = 0;
        } else {
          mt = 2;
        }

        var nodeStyle = {};
        if (typeof this.nodeWidth === "number") {
          nodeStyle.width = this.nodeWidth + 'px';
          nodeStyle.height = this.nodeWidth + 'px';
        }
        if (typeof ml === 'number') {
          nodeStyle.marginLeft = ml + 'px';
        }
        if (typeof mt === 'number') {
          nodeStyle.marginTop = mt + 'px';
        }
        html.setStyle(node, nodeStyle);
      },

      createPages: function() {
        var count, pages, p, pageNode, pointNode;
        count = this.items.length;
        pages = Math.ceil(count / 9);
        for (p = 0; p < pages; p++) {
          pageNode = this.createPageNode(p);
          this.createPageItems(p, pageNode);
          this.viewStack.addView(pageNode);
          if (pages > 1) {
            pointNode = this.createPointNode(p);
            on(pointNode, 'click', lang.hitch(this, this._onPageNodeClick, p));
          }
          this.pages.push({
            pageNode: pageNode,
            pointNode: pointNode
          });
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

      createPageItems: function(page, pageNode) {
        var count, i, b, e, empty;
        count = this.items.length;
        b = page * 9;
        e = (page + 1) * 9;
        empty = e - count;
        for (i = b; i < Math.min(e, count); i++) {
          this.createItemNode(i, pageNode);
        }
        for (i = count; i < count + empty; i++) {
          this.createEmptyItemNode(i, pageNode);
        }
      },

      createPageNode: function() {
        var node;
        node = domConstruct.create('div', {
          'class': 'page'
        });
        return node;
      },

      createPointNode: function() {
        var node;
        node = domConstruct.create('div', {
          'class': 'point'
        }, this.pointsNode);
        return node;
      },

      createItemNode: function(i, pageNode) {
        var node, item;
        item = this.items[i];
        node = domConstruct.create('div', {
          'class': 'icon-node',
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
        this.setItemNodePosition(node, i);
        on(node, 'click', lang.hitch(this, function() {
          this.onNodeClicked(node);
        }));

        this.nodes.push(node);
      },

      createEmptyItemNode: function(i, pageNode) {
        var node;
        node = domConstruct.create('div', {
          'class': 'icon-node'
        }, pageNode);
        this.setItemNodePosition(node, i);
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
      }

    });
  });