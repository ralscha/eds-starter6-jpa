Ext.define("Starter.model.UserSettings",
{
  extend : "Ext.data.Model",
  requires : [ "Ext.data.proxy.Direct", "Ext.data.validator.Email" ],
  fields : [ {
    name : "loginName",
    type : "string",
    validators : [ {
      type : "notBlank"
    } ]
  }, {
    name : "firstName",
    type : "string",
    validators : [ {
      type : "notBlank"
    } ]
  }, {
    name : "lastName",
    type : "string",
    validators : [ {
      type : "notBlank"
    } ]
  }, {
    name : "locale",
    type : "string",
    validators : [ {
      type : "notBlank"
    } ]
  }, {
    name : "email",
    type : "string",
    validators : [ {
      type : "email"
    }, {
      type : "notBlank"
    } ]
  }, {
    name : "currentPassword",
    type : "string"
  }, {
    name : "newPassword",
    type : "string"
  }, {
    name : "newPasswordRetype",
    type : "string"
  }, {
    name : "twoFactorAuth",
    type : "boolean"
  } ],
  proxy : {
    type : "direct",
    api : {
      read : "userConfigService.readSettings",
      update : "userConfigService.updateSettings"
    },
    reader : {
      rootProperty : "records"
    },
    writer : {
      writeAllFields : true
    }
  }
});