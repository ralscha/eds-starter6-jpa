Ext.define('Starter.view.user.Controller', {
	extend: 'Ext.app.ViewController',

	onGridRefresh: function() {
		this.getViewModel().set('selectedUser', null);
		this.getStore('users').reload();
	},

	onUsersStoreLoad: function(store) {
		var total = store.getTotalCount();
		this.getViewModel().set('totalCount', Ext.util.Format.plural(total, 'User', 'Users'));
	},

	newUser: function() {
		this.getViewModel().set('selectedUser', new Starter.model.User());
		this.edit();
	},

	onItemclick: function() {
		this.edit();
	},

	edit: function() {
		this.getView().add({
			xclass: 'Starter.view.user.Form'
		});

		var formPanel = this.getView().getLayout().next();

		Ext.defer(function() {
			formPanel.isValid();
		}, 1);
	},

	onLanguageChange: function() {
		// FIX. save button does not enable when language is selected
		this.lookup('editPanel').getForm().checkValidity();
	},

	back: function() {
		var user = this.getViewModel().get('selectedUser');
		if (user) {
			user.reject();
		}

		this.getView().getLayout().prev();
		this.getView().getLayout().getNext().destroy();
	},

	onFilter: function(tf) {
		var value = tf.getValue();
		var store = this.getStore('users');
		if (value) {
			this.getViewModel().set('filter', value);
			store.filter('filter', value);
		}
		else {
			this.getViewModel().set('filter', null);
			store.clearFilter();
		}
	},

	onFilterClear: function(tf) {
		tf.setValue('');
	},

	save: function() {
		var form = this.lookup('editPanel').getForm();
		if (form.isValid()) {
			this.getView().mask(i18n.saving);

			var user = this.getViewModel().get('selectedUser');
			user.save({
				scope: this,
				success: function(record, operation) {
					Starter.Util.successToast(i18n.savesuccessful);
					this.getStore('users').reload();
					this.back();
				},
				failure: function(record, operation) {
					Starter.Util.errorToast(i18n.inputcontainserrors);
					var validations = operation.getResponse().result.validations;
					Starter.Util.markInvalidFields(form, validations);
				},
				callback: function(record, operation, success) {
					this.getView().unmask();
				}
			});

		}
	},

	erase: function(record, errormsg, successCallback, errorCallback, scope) {
		var selectedUser = this.getViewModel().get('selectedUser');
		if (!selectedUser) {
			return;
		}

		Ext.Msg.confirm(i18n.attention, Ext.String.format(i18n.destroyConfirmMsg, selectedUser.get('email')), function(choice) {
			if (choice === 'yes') {
				selectedUser.erase({
					success: function(record, operation) {
						this.onGridRefresh();
						Starter.Util.successToast(i18n.destroysuccessful);
					},
					failure: function(record, operation) {
						Starter.Util.errorToast(i18n.user_lastadmin_error);
					},
					callback: function(records, operation, success) {
						this.back();
					},
					scope: this
				});
			}
		}, this);
	},

	switchTo: function() {
		var selectedUser = this.getViewModel().get('selectedUser');
		if (selectedUser) {
			securityService.switchUser(selectedUser.getId(), function(authUser) {
				if (authUser) {
					Starter.app.authUser = authUser;
					var currentLocation = window.location.toString();
					var hashPos = currentLocation.indexOf("#");
					if (hashPos > 0) {
						currentLocation = currentLocation.substring(0, hashPos) + '#auth.signin';
					}
					else {
						currentLocation += '#auth.signin';
					}
					window.location.replace(currentLocation);
					window.location.reload();
				}
			}, this);
		}
	},

	unlock: function() {
		var selectedUser = this.getViewModel().get('selectedUser');
		if (selectedUser) {
			userService.unlock(selectedUser.getId(), function() {
				Starter.Util.successToast(i18n.user_unlocked);
				selectedUser.set('lockedOutUntil', null, {
					commit: true
				});
				this.back();
			}, this);
		}
	},

	disableTwoFactorAuth: function() {
		var selectedUser = this.getViewModel().get('selectedUser');
		if (selectedUser) {
			userService.disableTwoFactorAuth(selectedUser.getId(), function() {
				Starter.Util.successToast(i18n.user_unlocked);
				selectedUser.set('twoFactorAuth', false, {
					commit: true
				});
				this.back();
			}, this);
		}
	},

	sendPwResetReq: function() {
		var selectedUser = this.getViewModel().get('selectedUser');
		if (selectedUser) {
			userService.sendPassordResetEmail(selectedUser.getId(), function() {
				Starter.Util.successToast(i18n.user_sent_pwresetreq);
			});
		}
	}

});