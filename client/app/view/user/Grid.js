Ext.define('Starter.view.user.Grid', {
	extend: 'Ext.grid.Panel',
	stateful: true,
	stateId: 'view.user.Grid',

	autoLoad: true,

	bind: {
		store: '{objects}',
		selection: '{selectedObject}'
	},

	listeners: {
		itemclick: 'onItemclick'
	},

	cls: 'shadow',
	viewConfig: {
		preserveScrollOnRefresh: true
	},

	columns: [ {
		text: i18n.user_loginname,
		dataIndex: 'loginName',
		flex: 1,
		stateId: 'view.user.Grid.loginName'
	}, {
		text: i18n.user_email,
		dataIndex: 'email',
		flex: 1,
		stateId: 'view.user.Grid.email'
	}, {
		text: i18n.user_lastname,
		dataIndex: 'lastName',
		flex: 1,
		stateId: 'view.user.Grid.lastName'
	}, {
		text: i18n.user_firstname,
		dataIndex: 'firstName',
		flex: 1,
		stateId: 'view.user.Grid.firstName'
	}, {
		xtype: 'templatecolumn', 
		tpl:  '<tpl for="authorities"><span class="label label-info">{.}</span>&nbsp;</tpl>',
		text: i18n.user_authorities,
		flex: 1,
		stateId: 'view.user.Grid.authorities'
	}, {
		xtype: 'datecolumn',
		format: 'Y-m-d H:i:s',
		text: i18n.user_lastaccess,
		dataIndex: 'lastAccess',
		width: 170,
		stateId: 'view.user.Grid.lastAccess'
	}, {
		text: i18n.user_enabled,
		dataIndex: 'enabled',
		width: 85,
		align: 'center',
		defaultRenderer: function(value) {
			if (value === true) {
				return '<span class="label label-success">' + i18n.yes + '</span>';
			}
			return '<span class="label label-error">' + i18n.no + '</span>';
		},
		stateId: 'view.user.Grid.enabled'
	}, {
		text: i18n.user_locked,
		dataIndex: 'lockedOutUntil',
		width: 95,
		align: 'center',
		defaultRenderer: function(value) {
			if (value) {
				return '<span class="label label-error">' + i18n.yes + '</span>';
			}
			return '<span class="label label-success">' + i18n.no + '</span>';
		},
		stateId: 'view.user.Grid.lockedOutUntil'
	} ],

	dockedItems: [ {
		xtype: 'toolbar',
		dock: 'top',
		items: [ {
			emptyText: i18n.filter,
			xtype: 'textfield',
			width: 250,
			plugins: [ {
				ptype: 'clearable'
			} ],
			listeners: {
				change: {
					fn: 'onFilter',
					buffer: 500
				}
			}
		}, '->', {
			text: i18n.create,
			iconCls: 'x-fa fa-plus',
			handler: 'newObject'
		} ]
	}, {
		xtype: 'toolbar',
		dock: 'bottom',
		padding: 0,
		items: [ {
			iconCls: 'x-fa fa-refresh',
			handler: 'onGridRefresh',
			cls: 'no-bg-button',
			tooltip: i18n.refresh
		}, {
			xtype: 'tbtext',
			bind: {
				text: '{totalCount}'
			}
		} ]
	} ]

});