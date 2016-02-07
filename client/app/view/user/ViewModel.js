Ext.define('Starter.view.user.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [ 'Ext.data.BufferedStore' ],

	data: {
		selectedObject: null,
		totalCount: null
	},

	stores: {
		objects: {
			model: 'Starter.model.User',
			autoLoad: false,
			buffered: true,
			remoteSort: true,
			remoteFilter: true,
			sorters: [ {
				property: 'lastName',
				direction: 'ASC'
			} ],
			listeners: {
				load: 'onObjectStoreLoad'
			},
			pageSize: 100,
			leadingBufferZone: 200
		}
	},

	formulas: {
		isUserDisabled: {
			bind: {
				bindTo: '{selectedObject}',
				deep: true
			},
			get: function(selectedObject) {
				return !selectedObject || selectedObject.phantom || !selectedObject.get('enabled');
			}
		},
		isPhantomObject: {
			bind: {
				bindTo: '{selectedObject}',
				deep: true
			},
			get: function(selectedObject) {
				return !selectedObject || selectedObject.phantom;
			}
		}
	}

});