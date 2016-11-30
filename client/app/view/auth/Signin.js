Ext.define('Starter.view.auth.Signin', {
	extend: 'Starter.view.base.LockingWindow',

	requires: [ 'Ext.toolbar.Spacer', 'Ext.form.Label', 'Ext.form.field.Text', 'Ext.form.field.Checkbox', 'Ext.button.Button' ],

	title: '<i class="x-fa fa-rocket"></i> ' + i18n.app_name + ': ' + i18n.auth_signin,
	defaultFocus: 'form',

	items: [ {
		xclass: 'Starter.view.auth.Dialog',
		defaultButton: 'loginButton',
		autoComplete: true,
		bodyPadding: '20 20',
		header: false,
		width: 415,
		layout: {
			type: 'vbox',
			align: 'stretch'
		},

		url: serverUrl + 'login',

		defaults: {
			margin: '5 0'
		},

		items: [ {
			xtype: 'label',
			text: i18n.auth_signin_info
		}, {
			xtype: 'textfield',
			name: 'username',
			height: 55,
			hideLabel: true,
			allowBlank: false,
			emptyText: i18n.auth_signin_loginname,
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop auth-email-trigger'
				}
			}
		}, {
			xtype: 'textfield',
			height: 55,
			hideLabel: true,
			emptyText: i18n.auth_signin_password,
			inputType: 'password',
			name: 'password',
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
			xtype: 'container',
			layout: 'hbox',
			items: [ {
				xtype: 'checkboxfield',
				flex: 1,
				height: 30,
				name: 'remember-me',
				boxLabel: i18n.auth_signin_rememberme
			}, {
				xtype: 'component',
				html: '<a href="#auth.pwresetreq" class="link-forgot-password"> ' + i18n.auth_signin_forgotpw + '</a>',
				listeners: {
					afterrender: 'onForgotPasswordAfterRender'
				}
			} ]
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
		}
		// <debug>
		, {
			xtype: 'button',
			scale: 'large',
			ui: 'soft-green',
			iconAlign: 'right',
			iconCls: 'x-fa fa-angle-right',
			text: 'ADMIN ' + i18n.auth_signin,
			listeners: {
				click: 'onLoginAsAdminButtonClick'
			}
		}, {
			xtype: 'button',
			scale: 'large',
			ui: 'soft-green',
			iconAlign: 'right',
			iconCls: 'x-fa fa-angle-right',
			text: 'USER ' + i18n.auth_signin,
			listeners: {
				click: 'onLoginAsUserButtonClick'
			}
		}
		// </debug>

		]
	} ]
});
