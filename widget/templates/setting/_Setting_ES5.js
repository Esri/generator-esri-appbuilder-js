define([
  'dojo/_base/declare',
  'jimu/BaseWidgetSetting'
],
function(declare, BaseWidgetSetting) {

  return declare([BaseWidgetSetting], {
    baseClass: '<%= baseClass %>-setting',

    postCreate: function(){
      //the config object is passed in
      this.setConfig(this.config);
    },

    setConfig: function(config){
      this.textNode.value = config.serviceUrl;
    },

    getConfig: function(){
      //WAB will get config object through this method
      return {
        serviceUrl: this.textNode.value
      };
    }
  });
});
