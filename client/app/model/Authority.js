Ext.define('Starter.model.Authority', {
	extend: 'Ext.data.Model',

	fields: [ {
		name: 'name',
		type: 'string'
	} ],
	
	proxy: {
		type: 'direct',
		directFn: 'userService.readAuthorities'
	}
});
