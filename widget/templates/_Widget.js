define(['dojo/_base/declare', 'jimu/BaseWidget'],
function(declare, BaseWidget) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    // Custom widget code goes here

    baseClass: '<%= baseClass %>',
    // this property is set by the framework when widget is loaded.
    // name: '<%= widgetName %>',
    // add additional properties here

    //methods to communication with app container:
    postCreate: function() {
      this.inherited(arguments);
      console.log('<%= widgetName %>::postCreate');
    }

    // startup: function() {
    //   this.inherited(arguments);
    //   console.log('<%= widgetName %>::startup');
    // },

    // onOpen: function(){
    //   console.log('<%= widgetName %>::onOpen');
    // },

    // onClose: function(){
    //   console.log('<%= widgetName %>::onClose');
    // },

    // onMinimize: function(){
    //   console.log('<%= widgetName %>::onMinimize');
    // },

    // onMaximize: function(){
    //   console.log('<%= widgetName %>::onMaximize');
    // },

    // onSignIn: function(credential){
    //   console.log('<%= widgetName %>::onSignIn', credential);
    // },

    // onSignOut: function(){
    //   console.log('<%= widgetName %>::onSignOut');
    // }

    // onPositionChange: function(){
    //   console.log('<%= widgetName %>::onPositionChange');
    // },

    // resize: function(){
    //   console.log('<%= widgetName %>::resize');
    // }

//methods to communication between widgets:

  });

});
