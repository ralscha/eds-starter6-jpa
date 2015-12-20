Ext.define("Starter.model.User",
{
  extend : "Ext.data.Model",
  requires : [ "Ext.data.identifier.Negative", "Ext.data.proxy.Direct", "Ext.data.validator.Email", "Ext.data.validator.Length" ],
  identifier : "negative",
  fields : [ {
    name : "twoFactorAuth",
    type : "boolean",
    persist : false
  }, {
    name : "loginName",
    type : "string",
    validators : [ {
      type : "notBlank"
    }, {
      type : "length",
      min : 0,
      max : 255
    } ]
  }, {
    name : "lastName",
    type : "string",
    validators : [ {
      type : "notBlank"
    }, {
      type : "length",
      min : 0,
      max : 255
    } ]
  }, {
    name : "firstName",
    type : "string",
    validators : [ {
      type : "notBlank"
    }, {
      type : "length",
      min : 0,
      max : 255
    } ]
  }, {
    name : "email",
    type : "string",
    validators : [ {
      type : "email"
    }, {
      type : "length",
      min : 0,
      max : 255
    }, {
      type : "notBlank"
    } ]
  }, {
    name : "authorities",
    type : "string"
  }, {
    name : "locale",
    type : "string",
    validators : [ {
      type : "notBlank"
    }, {
      type : "length",
      min : 0,
      max : 8
    } ]
  }, {
    name : "enabled",
    type : "boolean"
  }, {
    name : "failedLogins",
    type : "integer",
    persist : false
  }, {
    name : "lockedOutUntil",
    type : "date",
    dateFormat : "time",
    persist : false
  }, {
    name : "lastAccess",
    type : "date",
    dateFormat : "time",
    persist : false
  }, {
    name : "id",
    type : "integer",
    allowNull : true,
    convert : null
  } ],
  proxy : {
    type : "direct",
    api : {
      read : "userService.read",
      create : "userService.update",
      update : "userService.update",
      destroy : "userService.destroy"
    },
    reader : {
      rootProperty : "records"
    },
    writer : {
      writeAllFields : true
    }
  }
});