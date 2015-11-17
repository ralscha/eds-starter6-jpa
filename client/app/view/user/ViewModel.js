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
		},
		authorities: {
			model: 'Starter.model.Authority',
			autoLoad: true,
			remoteFilter: false,
			remoteSort: false,
			pageSize: 0
		}
	},

	formulas: {
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