Ext.define('Starter.view.user.Container', {
	extend: 'Ext.container.Container',

	layout: {
		type: 'card'
	},

	controller: {
		xclass: 'Starter.view.user.Controller'
	},

	viewModel: {
		xclass: 'Starter.view.user.ViewModel'
	},

	items: [ {
		xclass: 'Starter.view.user.Grid'
	} ]
});