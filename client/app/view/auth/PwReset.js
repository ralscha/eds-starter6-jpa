Ext.define('Starter.view.auth.PwReset', {
	extend: 'Starter.view.base.LockingWindow',

	title: '<i class="x-fa fa-rocket"></i> ' + i18n.app_name + ': ' + i18n.auth_pwreset,

	defaultFocus: 'form',

	items: [ {
		xclass: 'Starter.view.auth.Dialog',
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
			submit: 'securityService.reset'
		},
		paramsAsHash: true,

		cls: 'auth-dialog-login',
		items: [ {
			xtype: 'label',
			cls: 'lock-screen-top-label',
			text: i18n.auth_pwreset_newpw
		}, {
			xtype: 'textfield',
			height: 55,
			hideLabel: true,
			emptyText: i18n.auth_signin_password,
			inputType: 'password',
			name: 'newPassword',
			allowBlank: false,
			enableKeyEvents: true,
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-password-trigger'
				}
			},
			listeners: {
				render: 'onPasswordRender',
				keypress: 'onPasswordKeypress',
				blur: 'onPasswordBlur'
			}
		}, {
			xtype: 'textfield',
			height: 55,
			hideLabel: true,
			emptyText: i18n.auth_signin_password,
			inputType: 'password',
			name: 'newPasswordRetype',
			allowBlank: false,
			enableKeyEvents: true,
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-password-trigger'
				}
			},
			listeners: {
				render: 'onPasswordRender',
				keypress: 'onPasswordKeypress',
				blur: 'onPasswordBlur'
			}
		}, {
			xtype: 'button',
			reference: 'resetPassword',
			scale: 'large',
			ui: 'soft-blue',
			formBind: true,
			iconAlign: 'right',
			iconCls: 'x-fa fa-angle-right',
			text: i18n.auth_pwreset,
			listeners: {
				click: 'onResetClick'
			}
		}, {
			xtype: 'component',
			html: '<div style="text-align:right">' + '<a href="#auth.signin" class="link-forgot-password">' + i18n.auth_backtosignin + '</a></div>'
		} ]
	} ]
});
