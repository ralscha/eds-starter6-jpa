Ext.define('Starter.Util', {
	singleton: true,
	requires: [ 'Ext.window.Toast' ],

	successToast: function(msg) {
		Ext.toast({
			html: msg,
			title: i18n.successful,
			align: 't',
			shadow: true,
			width: 200,
			slideInDuration: 100,
			hideDuration: 100,
			bodyStyle: {
				background: '#90b962',
				color: 'white',
				textAlign: 'center',
				fontWeight: 'bold'
			}
		});
	},

	errorToast: function(msg) {
		Ext.toast({
			html: msg,
			title: i18n.error,
			align: 't',
			shadow: true,
			width: 200,
			slideInDuration: 100,
			hideDuration: 100,
			bodyStyle: {
				background: '#d24352',
				color: 'white',
				textAlign: 'center',
				fontWeight: 'bold'
			}
		});
	},

	underline: function(str, c) {
		var pos = str.indexOf(c);
		if (pos !== -1) {
			return str.substring(0, pos) + '<u>' + c + '</u>' + str.substring(pos + 1);
		}
		return str;
	},

	markInvalidFields: function(form, validations) {
		validations.forEach(function(validation) {
			var field = form.findField(validation.field);
			if (field) {
				field.markInvalid(validation.messages);
			}
		});
	}

});