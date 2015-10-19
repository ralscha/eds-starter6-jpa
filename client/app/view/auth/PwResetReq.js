Ext.define('Starter.view.auth.PwResetReq', {
	extend: 'Starter.view.base.LockingWindow',

	title: '<i class="x-fa fa-rocket"></i> ' + i18n.app_name + ': ' + i18n.auth_pwresetreq,

	defaultFocus: 'form',

	items: [ {
		xclass: 'Starter.view.auth.Dialog',
		listeners: {
			beforerender: 'onResetRequestBeforeRender'
		},
		width: 455,
		defaultButton: 'resetPassword',
		autoComplete: true,
		bodyPadding: '20 20',
		layout: {
			type: 'vbox',
			align: 'stretch'
		},

		defaults: {
			margin: '5 0'
		},

		api: {
			submit: 'securityService.resetRequest'
		},
		paramsAsHash: true,

		cls: 'auth-dialog-login',
		items: [ {
			xtype: 'label',
			cls: 'lock-screen-top-label',
			text: i18n.auth_pwresetreq_info
		}, {
			xtype: 'textfield',
			cls: 'auth-textbox',
			height: 55,
			name: 'email',
			hideLabel: true,
			allowBlank: false,
			emptyText: 'user@example.com',
			vtype: 'email',
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-email-trigger'
				}
			}
		}, {
			xtype: 'button',
			reference: 'resetPassword',
			scale: 'large',
			ui: 'soft-blue',
			formBind: true,
			iconAlign: 'right',
			iconCls: 'x-fa fa-angle-right',
			text: i18n.auth_pwresetreq,
			listeners: {
				click: 'onResetRequestClick'
			}
		}, {
			xtype: 'component',
			html: '<div style="text-align:right">' + '<a href="#auth.signin" class="link-forgot-password">' + i18n.auth_backtosignin + '</a></div>'
		} ]
	} ]
});
