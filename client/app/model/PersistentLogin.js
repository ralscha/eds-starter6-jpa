Ext.define("Starter.model.PersistentLogin",
{
  extend : "Ext.data.Model",
  requires : [ "Ext.data.proxy.Direct", "Ext.data.validator.Length" ],
  idProperty : "series",
  fields : [ {
    name : "series",
    type : "string"
  }, {
    name : "lastUsed",
    type : "date",
    dateFormat : "time"
  }, {
    name : "ipAddress",
    type : "string",
    validators : [ {
      type : "length",
      min : 0,
      max : 39
    } ]
  }, {
    name : "userAgentName",
    type : "string"
  }, {
    name : "userAgentVersion",
    type : "string"
  }, {
    name : "operatingSystem",
    type : "string"
  } ],
  proxy : {
    type : "direct",
    idParam : "series",
    api : {
      read : "userConfigService.readPersistentLogins",
      destroy : "userConfigService.destroyPersistentLogin"
    }
  }
});