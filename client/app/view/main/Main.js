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
		type: 'vbox',
		align: 'stretch'
	},

	items: [ {
		xtype: 'toolbar',
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
		xclass: 'Starter.view.main.MainContainer',
		reference: 'mainContainer',
		flex: 1,
		items: [ {
			xtype: 'treelist',
			reference: 'navigationTreeList',
			itemId: 'navigationTreeList',
			ui: 'navigation',
			store: 'navigation',
			width: 250,
			expanderFirst: false,
			expanderOnly: false,
			animation: {
				duration: 100,
				easing: 'ease'
			},
			listeners: {
				selectionchange: 'onNavigationTreeSelectionChange'
			}
		}, {
			xtype: 'container',
			flex: 1,
			reference: 'mainCardPanel',
			padding: 8,
			layout: {
				type: 'card'
			}
		} ]
	} ]
});
