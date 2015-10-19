Ext.define('Starter.view.user.ViewModel', {
	extend: 'Ext.app.ViewModel',
	requires: [ 'Ext.data.BufferedStore' ],

	data: {
		selectedUser: null,
		totalCount: null
	},

	stores: {
		users: {
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
				load: 'onUsersStoreLoad'
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
		newUser: function(get) {
			var su = get('selectedUser');
			return !su || su.phantom;
		}
	}

});