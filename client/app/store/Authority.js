Ext.define('Starter.store.Authority', {
	extend: 'Ext.data.Store',
	storeId: 'authority',
	data: [
		{ value: Starter.constant.Authority.ADMIN },
		{ value: Starter.constant.Authority.USER }
	]
});