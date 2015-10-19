Ext.define('Starter.view.auth.PwResetConfirm', {
	extend: 'Starter.view.base.LockingWindow',

	title: '<i class="x-fa fa-rocket"></i> ' + i18n.app_name + ': ' + i18n.auth_pwresetreq,

	cls: 'signout-page-container',
	items: [ {
		xtype: 'container',
		cls: 'error-page-inner-container',
		layout: {
			type: 'vbox',
			align: 'center',
			pack: 'center'
		},
		items: [ {
			xtype: 'label',
			cls: 'signout-page-top-text',
			text: i18n.auth_pwresetreq_confirm_info1
		}, {
			xtype: 'label',
			cls: 'signout-page-desc',
			text: i18n.auth_pwresetreq_confirm_info2
		}, {
			xtype: 'label',
			cls: 'signout-page-desc',
			html: '<div><a href="#auth.signin">' + i18n.auth_backtosignin + '</a></div>'
		} ]
	} ]

});
