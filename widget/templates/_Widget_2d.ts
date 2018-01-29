// JIMU (WAB) imports:

/// <amd-dependency path="jimu/BaseWidget" name="BaseWidget" />
declare var BaseWidget: any; // there is no ts definition of BaseWidget (yet!)

// DeclareDecorator - to enable us to export this module with Dojo's "declare()" syntax so WAB can load it:
import declare from "./support/declareDecorator";

// Esri imports:
import esri = require('esri');
import EsriMap = require('esri/map');

// Dojo imports: (example below)
// import * as on from 'dojo/on'; 

interface Config {
  serviceUrl: string
}
interface Widget {
  config?: Config
}

@declare(BaseWidget)
class Widget {
  baseClass = 'my-widget';

  map: EsriMap;

  postCreate(args: any) {
    let self: any = this;
    self.inherited(arguments);
    console.log('<%= widgetName %>::postCreate');
  };
};

export = Widget;