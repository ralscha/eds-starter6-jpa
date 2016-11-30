Ext.define('Starter.view.base.ViewController', {
	extend: 'Ext.app.ViewController',
	requires: 'Starter.view.base.GridCellToolTip',

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
		var store = this.getStore(this.getObjectStoreName());
		if (store.buffered) {
			this.getStore(this.getObjectStoreName()).load();
		}
		else {
		this.getStore(this.getObjectStoreName()).reload();
		}
	},

	newObject: function() {
		var model = this.getStore(this.getObjectStoreName()).getModel();
		var record = model.create();
		this.getViewModel().set(this.getSelectedObjectName(), record);
		this.edit(record);
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

	onItemclick: function(store, record) {
    	this.getViewModel().set(this.getSelectedObjectName(), record);
		this.edit(record);
	},

	edit: function(record) {
		var formPanel = this.lookup('editPanel');
		
		if (!formPanel) {
			formPanel = this.getView().add({
			xclass: this.getFormClassName()
		});
		}
		this.getView().getLayout().setActiveItem(formPanel);

		var form = formPanel.getForm();
        form.reset();
        form.loadRecord(record);        
        form.isValid();
	},

	back: function() {
		this.getView().getLayout().prev();
	},

	save: function(callback) {
		var form = this.lookup('editPanel').getForm();
		if (form.isValid()) {
			this.getView().mask(i18n.saving);

			form.updateRecord();
			var record = form.getRecord()
			var isPhantom = record.phantom;
			
			this.preSave(record);
			record.save({
				scope: this,
				success: function(record, operation) {
					
					if (this.getReloadAfterEdit()) {
						this.onGridRefresh();
					}
					else {
						if (isPhantom) {
							var store = this.getStore(this.getObjectStoreName());
							store.totalCount = store.getTotalCount() + 1;
							store.add(record); 
						}
					}
					
					this.afterSuccessfulSave(isPhantom, record);
					Starter.Util.successToast(i18n.savesuccessful);
					this.back();
					if (Ext.isFunction(callback)) {
						callback.call(this, record);
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
	preSave: Ext.emptyFn,
	afterSuccessfulSave: Ext.emptyFn,

	eraseObject: function(errormsg, successCallback, failureCallback, scope) {
		var selectedObject = this.getSelectedObject();
		if (!selectedObject) {
			return;
		}

		Ext.Msg.confirm(i18n.attention, Ext.String.format(i18n.destroyConfirmMsg, errormsg), function(choice) {
			if (choice === 'yes') {
				var store = this.getStore(this.getObjectStoreName());
				
				if (!this.getReloadAfterEdit()) {
					store.totalCount = store.getTotalCount() - 1;
				}
				
				selectedObject.erase({
					success: function(record, operation) {
						if (this.getReloadAfterEdit()) {
						this.onGridRefresh();
						}

						Starter.Util.successToast(i18n.destroysuccessful);
						if (successCallback) {
							successCallback.call(scope);
						}
					},
					failure: function(record, operation) {
						if (this.getReloadAfterEdit()) {
							this.onGridRefresh();
						} 
						else {
							store.totalCount = store.getTotalCount() + 1;
							store.add(selectedObject);
						}
						
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