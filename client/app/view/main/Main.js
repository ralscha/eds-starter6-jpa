Ext.define('Starter.view.main.Main', {
	extend: 'Ext.container.Viewport',
	requires: [ 'Ext.list.Tree', 'Ext.toolbar.Toolbar' ],

	controller: {
		xclass: 'Starter.view.main.MainController'
	},

	viewModel: {
		xclass: 'Starter.view.main.MainModel'
	},

	layout: {
		type: 'border'
	},

	items: [ {
		xtype: 'toolbar',
		region: 'north',
		cls: 'app-dash-dash-headerbar shadow',
		height: 44,
		items: [ {
			xtype: 'component',
			reference: 'appLogo',
			cls: 'app-logo',
			html: '<div><i class="x-fa fa-rocket"></i><span>' + i18n.app_name + '</span></div>',
			width: 250
		}, {
			cls: 'no-bg-button',
			iconCls: 'x-fa fa-navicon',
			handler: 'onToggleNavigationSize'
		}, {
			xtype: 'tbtext',
			cls: 'navigation-title',
			bind: {
				text: '{navigationTitle}'
			}
		}, {
			xtype: 'tbspacer',
			flex: 1
		}, {
			cls: 'no-bg-button',
			iconCls: 'x-fa fa-cog',
			href: '#userconfig',
			hrefTarget: '_self',
			tooltip: i18n.userconfig
		}, {
			xtype: 'tbtext',
			bind: {
				text: '{fullName}'
			}
		}, {
			cls: 'no-bg-button',
			iconCls: 'x-fa fa-sign-out',
			handler: 'onLogoutClick',
			tooltip: i18n.auth_signout
		} ]
	}, {
		xtype: 'container',
		reference: 'mainContainer',
		region: 'center',
		layout: 'border',
		items: [ {
			region: 'west',
			width: 250,
			xtype: 'treelist',
			reference: 'navigationTreeList',
			ui: 'navigation',
			store: 'navigation',
			expanderFirst: false,
			expanderOnly: false,
			listeners: {
				selectionchange: 'onNavigationTreeSelectionChange'
			}
		}, {
			region: 'center',
			xtype: 'container',
			reference: 'mainCardPanel',
			padding: 8,
			layout: {
				type: 'card'
			}
		} ]
	} ]
});
