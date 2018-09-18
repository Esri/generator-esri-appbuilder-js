// jIMU (WAB) imports:

/// <amd-dependency path="jimu/BaseWidget" name="BaseWidget" />
declare var BaseWidget: any; // there is no ts definition of BaseWidget (yet!)

// declareDecorator - to enable us to export this module with Dojo's "declare()" syntax so WAB can load it:
import declare from "./support/declareDecorator";

// esri imports:
import SceneView = require("esri/views/SceneView");

// dojo imports: (example below)
// import * as on from 'dojo/on';

interface Config {
  serviceUrl: string;
}
interface Widget {
  config?: Config;
}

@declare(BaseWidget)
class Widget {
  baseClass = "<%= baseClass %>";

  sceneView: SceneView;

  postCreate(args: any) {
    let self: any = this;
    self.inherited(arguments);
    console.log("<%= widgetName %>::postCreate");
  }
  // startup() {
  //   let self: any = this;
  //   self.inherited(arguments);
  //   console.log('<%= widgetName %>::startup');
  // };
  // onOpen() {
  //   console.log('<%= widgetName %>::onOpen');
  // };
  // onClose(){
  //   console.log('<%= widgetName %>::onClose');
  // };
  // onMinimize(){
  //   console.log('<%= widgetName %>::onMinimize');
  // };
  // onMaximize(){
  //   console.log('<%= widgetName %>::onMaximize');
  // };
  // onSignIn(credential){
  //   console.log('<%= widgetName %>::onSignIn', credential);
  // };
  // onSignOut(){
  //   console.log('<%= widgetName %>::onSignOut');
  // };
  // onPositionChange(){
  //   console.log('<%= widgetName %>::onPositionChange');
  // };
  // resize(){
  //   console.log('<%= widgetName %>::resize');
  // };

}

export = Widget;