// jIMU (WAB) imports:
/// <amd-dependency path="jimu/BaseWidget" name="BaseWidget" />
declare var BaseWidget: any; // there is no ts definition of BaseWidget (yet!)
// declareDecorator - to enable us to export this module with Dojo's "declare()" syntax so WAB can load it:
import declare from './support/declareDecorator';

// esri imports:
import EsriMap from 'esri/map';

// dojo imports:
// import * as on from 'dojo/on';

import IConfig from './config';

interface IWidget {
  baseClass: string;
  config?: IConfig;
}

@declare(BaseWidget)
class Widget implements IWidget {
  public baseClass: string = '<%= baseClass %>';
  public config: IConfig;

  private map: EsriMap;

  private postCreate(args: any): void {
    const self: any = this;
    self.inherited(arguments);
    console.log('<%= widgetName %>::postCreate');
  }
  // private startup(): void {
  //   let self: any = this;
  //   self.inherited(arguments);
  //   console.log('<%= widgetName %>::startup');
  // };
  // private onOpen(): void {
  //   console.log('<%= widgetName %>::onOpen');
  // };
  // private onClose(): void {
  //   console.log('<%= widgetName %>::onClose');
  // };
  // private onMinimize(): void {
  //   console.log('<%= widgetName %>::onMinimize');
  // };
  // private onMaximize(): void {
  //   console.log('<%= widgetName %>::onMaximize');
  // };
  // private onSignIn(credential): void {
  //   console.log('<%= widgetName %>::onSignIn', credential);
  // };
  // private onSignOut(): void {
  //   console.log('<%= widgetName %>::onSignOut');
  // };
  // private onPositionChange(): void {
  //   console.log('<%= widgetName %>::onPositionChange');
  // };
  // private resize(): void {
  //   console.log('<%= widgetName %>::resize');
  // };
}

export = Widget;
