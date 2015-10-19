Ext.define('Starter.view.userconfig.ViewModel', {
	extend: 'Ext.app.ViewModel',

	data: {
		secret: null
	},

	stores: {
		persistentLogins: {
			model: 'Starter.model.PersistentLogin',
			autoLoad: false,
			remoteSort: false,
			remoteFilter: false,
			pageSize: 0,
			sorters: [ {
				property: 'lastUsed',
				direction: 'DESC'
			} ]
		}
	}

});