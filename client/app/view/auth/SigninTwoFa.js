Ext.define('Starter.view.auth.SigninTwoFa', {
	extend: 'Starter.view.base.LockingWindow',

	title: '<i class="x-fa fa-rocket"></i> ' + i18n.app_name + ': ' + i18n.auth_signin,
	defaultFocus: 'form',

	items: [ {
		xclass: 'Starter.view.auth.Dialog',
		defaultButton: 'loginButton',
		autoComplete: false,
		bodyPadding: '20 20',
		header: false,
		width: 415,
		layout: {
			type: 'vbox',
			align: 'stretch'
		},

		api: {
			submit: 'securityService.signin2fa'
		},
		paramsAsHash: true,

		defaults: {
			margin: '5 0'
		},

		items: [ {
			xtype: 'label',
			text: i18n.auth_2fa_info
		}, {
			xtype: 'numberfield',
			hideTrigger: true,
			minValue: 0,
			maxValue: 999999,
			name: 'code',
			height: 55,
			hideLabel: true,
			allowBlank: false,
			cls: 'verificationcode'
		}, {
			xtype: 'button',
			reference: 'loginButton',
			scale: 'large',
			ui: 'soft-green',
			iconAlign: 'right',
			iconCls: 'x-fa fa-angle-right',
			text: i18n.auth_signin,
			formBind: true,
			listeners: {
				click: 'onLoginButtonClick'
			}
		}, {
			xtype: 'component',
			html: '<div style="text-align:right">' + '<a href="#auth.signin" class="link-forgot-password">' + i18n.auth_backtosignin + '</a></div>'
		} ]
	} ]
});
