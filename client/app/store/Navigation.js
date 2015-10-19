Ext.define('Starter.store.Navigation', {
	extend: 'Ext.data.TreeStore',
	storeId: 'navigation',
	autoLoad: false,
	fields: [ {
		name: 'text'
	} ],
	root: {
		expanded: true,
		children: []
	},
	proxy: {
		type: 'direct',
		directFn: 'navigationService.getNavigation'
	}
});
