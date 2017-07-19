Ext.define('Starter.view.userconfig.Controller', {
	extend: 'Ext.app.ViewController',

	initViewModel: function() {
		var userSettings = new Starter.model.UserSettings();
		userSettings.load({
			scope: this,
			success: function(record, operation) {
				this.getViewModel().set('user', userSettings);
			}
		});
	},

	save: function() {
		this.getView().mask(i18n.saving);

		var userSettings = this.getViewModel().get('user');

		// FIX: Somehow the field value of newPassword is not bound to the model
		var form = this.getView().down('form').getForm();
		userSettings.set('newPassword', form.findField('newPassword').getValue());
		// FIX: END

		userSettings.save({
			scope: this,
			success: function(record, operation) {
				Starter.Util.successToast(i18n.savesuccessful);
			},
			failure: function(record, operation) {
				Starter.Util.errorToast(i18n.inputcontainserrors);
				var form = this.lookup('userConfigForm').getForm();
				var validations = operation.getResponse().result.validations;
				Starter.Util.markInvalidFields(form, validations);
			},
			callback: function(record, operation, success) {
				this.getView().unmask();
			}
		});

	},

	clearState: function() {
		localStorage.removeItem("starter_navigation_micro");
		
		var store = Ext.state.Manager.getProvider().store;
		store.clear();
		location.reload();
	},

	destroyPersistentLogin: function(view, rowIndex, colIndex, item, e, record, row) {
		record.erase({
			callback: function() {
				Starter.Util.successToast(i18n.destroysuccessful);
			}
		});
	},

	enable2f: function() {
		var vm = this.getViewModel();
		userConfigService.enable2f(function(secret) {
			Starter.Util.successToast(i18n.userconfig_2fa_enabled);
			vm.set('secret', secret);
			vm.set('user.twoFactorAuth', true);
			this.lookup('twoFactorPanel').add({
				xtype: 'image',
				src: 'qr',
				width: 200,
				height: 200,
				alt: secret
			});
		}, this);
	},

	disable2f: function() {
		var vm = this.getViewModel();
		userConfigService.disable2f(function() {
			Starter.Util.successToast(i18n.userconfig_2fa_disabled);
			vm.set('user.twoFactorAuth', false);
			vm.set('secret', null);
			var qrimage = this.lookup('twoFactorPanel').down('image');
			if (qrimage) {
				qrimage.destroy();
			}
		}, this);
	}

});