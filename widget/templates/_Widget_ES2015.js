import declare from 'dojo/_base/declare';
import BaseWidget from 'jimu/BaseWidget';

//To create a widget, you need to derive from BaseWidget.
export default declare([BaseWidget], {

  // Custom widget code goes here

  baseClass: '<%= baseClass %>',

  // add additional properties here

  //methods to communication with app container:
  postCreate() {
    this.inherited(arguments);
    console.log('<%= widgetName %>::postCreate');
  }
  // startup() {
  //   this.inherited(arguments);
  //   console.log('<%= widgetName %>::startup');
  // },
  // onOpen() {
  //   console.log('<%= widgetName %>::onOpen');
  // },
  // onClose(){
  //   console.log('<%= widgetName %>::onClose');
  // },
  // onMinimize(){
  //   console.log('<%= widgetName %>::onMinimize');
  // },
  // onMaximize(){
  //   console.log('<%= widgetName %>::onMaximize');
  // },
  // onSignIn(credential){
  //   console.log('<%= widgetName %>::onSignIn', credential);
  // },
  // onSignOut(){
  //   console.log('<%= widgetName %>::onSignOut');
  // }
  // onPositionChange(){
  //   console.log('<%= widgetName %>::onPositionChange');
  // },
  // resize(){
  //   console.log('<%= widgetName %>::resize');
  // }
});
