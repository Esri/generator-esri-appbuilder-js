define([
  'dojo/_base/declare',

  'jimu/BaseWidget'
], function(
  declare,
  BaseWidget
) {

  var clazz = declare([BaseWidget], {
    //these two properties are defined in the BaseWiget
    baseClass: '<%= baseClass %>',
    name: '<%= widgetName %>',

    // add additional properties here

    postCreate: function() {
      // summary:
      //      Overrides method of same name in dijit._Widget.
      // tags:
      //      private
      this.inherited(arguments);
      console.log('<%= widgetName %>::postCreate', arguments);

      // add additional post constructor logic here
    },

    // start up child widgets
    startup: function() {
      // summary:
      //      Overrides method of same name in dijit._Widget.
      // tags:
      //      private
      this.inherited(arguments);
      console.log('<%= widgetName %>::startup', arguments);
    },

    onOpen: function() {
      // summary:
      //      Overrides method of same name in jimu._BaseWidget.
      console.log('<%= widgetName %>::onOpen', arguments);

      // add code to execute whenever the widget is opened
    },

    onClose: function() {
      // summary:
      //      Overrides method of same name in jimu._BaseWidget.
      console.log('<%= widgetName %>::onClose', arguments);

      // add code to execute whenever the widget is closed
    }
  });

  return clazz;
});