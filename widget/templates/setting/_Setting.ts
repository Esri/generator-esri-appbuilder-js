// JIMU (WAB) imports:

/// <amd-dependency path="jimu/BaseWidgetSetting" name="BaseWidgetSetting" />
declare var BaseWidgetSetting: any; // there is no ts definition of BaseWidgetSetting (yet!)

// DeclareDecorator - to enable us to export this module with Dojo's "declare()" syntax so WAB can load it:
import declare from '../support/declareDecorator';

import IConfig from '../config';

interface ISetting {
  config?: IConfig;
}

@declare(BaseWidgetSetting)
class Setting implements ISetting {
  public baseClass: string = '<%= baseClass %>-setting';
  public config: IConfig;

  private textNode: HTMLInputElement;

  private postCreate(args: any): void {
    const self: any = this;
    self.inherited(arguments);
    this.setConfig(this.config);
  }

  private setConfig(config: IConfig): void {
    this.textNode.value = config.serviceUrl;
  }

  private getConfig(): object {
    // WAB will get config object through this method
    return {
      serviceUrl: this.textNode.value,
    };
  }
}

export = Setting;
