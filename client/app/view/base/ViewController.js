Ext.define('Starter.view.base.ViewController', {
	extend: 'Ext.app.ViewController',

	config: {
		objectStoreName: 'objects',
		selectedObjectName: 'selectedObject',
		formClassName: null,
		objectName: 'Object',
		objectNamePlural: 'Objects'
	},

	onObjectStoreLoad: function(store) {
		var total = store.getTotalCount();
		this.getViewModel().set('totalCount', Ext.util.Format.plural(total, this.getObjectName(), this.getObjectNamePlural()));
	},

	getSelectedObject: function() {
		return this.getViewModel().get(this.getSelectedObjectName());
	},

	onGridRefresh: function() {
		this.getViewModel().set(this.getSelectedObjectName(), null);
		this.getStore(this.getObjectStoreName()).reload();
	},

	newObject: function() {
		var model = this.getStore(this.getObjectStoreName()).getModel();
		this.getViewModel().set(this.getSelectedObjectName(), model.create());
		this.edit();
	},

	onFilter: function(tf) {
		var value = tf.getValue();
		var store = this.getStore(this.getObjectStoreName());
		if (value) {
			this.getViewModel().set('filter', value);
			store.filter('filter', value);
		}
		else {
			this.getViewModel().set('filter', null);
			store.removeFilter('filter');
		}
	},

	onItemclick: function() {
		this.edit();
	},

	edit: function() {
		this.getView().add({
			xclass: this.getFormClassName()
		});

		var formPanel = this.getView().getLayout().next();

		Ext.defer(function() {
			formPanel.isValid();
		}, 1);
	},

	back: function() {
		var selectedObject = this.getSelectedObject();
		if (selectedObject) {
			selectedObject.reject();
		}

		this.getView().getLayout().prev();
		this.getView().getLayout().getNext().destroy();
	},

	save: function(callback) {
		var form = this.lookup('editPanel').getForm();
		if (form.isValid()) {
			this.getView().mask(i18n.saving);

			var selectedObject = this.getSelectedObject();
			selectedObject.save({
				scope: this,
				success: function(record, operation) {
					Starter.Util.successToast(i18n.savesuccessful);
					this.getStore(this.getObjectStoreName()).reload();
					this.back();
					this.afterSuccessfulSave();
					if (Ext.isFunction(callback)) {
						callback.call(this);
					}
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

	afterSuccessfulSave: Ext.emptyFn,

	eraseObject: function(errormsg, successCallback, failureCallback, scope) {
		var selectedObject = this.getSelectedObject();
		if (!selectedObject) {
			return;
		}

		Ext.Msg.confirm(i18n.attention, Ext.String.format(i18n.destroyConfirmMsg, errormsg), function(choice) {
			if (choice === 'yes') {
				selectedObject.erase({
					success: function(record, operation) {
						this.onGridRefresh();
						Starter.Util.successToast(i18n.destroysuccessful);
						if (successCallback) {
							successCallback.call(scope);
						}
					},
					failure: function(record, operation) {
						if (failureCallback) {
							failureCallback.call(scope);
						}
						else {
							Starter.Util.errorToast(i18n.servererror);
						}
					},
					callback: function(records, operation, success) {
						this.back();
					},
					scope: this
				});
			}
		}, this);
	}
});