Ext.define('Starter.view.auth.LockScreen', {
	extend: 'Starter.view.base.LockingWindow',

	title: '<i class="x-fa fa-rocket"></i> ' + i18n.app_name + ': ' + i18n.auth_locked,

	defaultFocus: 'form',

	items: [ {
		xclass: 'Starter.view.auth.Dialog',
		defaultButton: 'resumeButton',
		autoComplete: false,
		bodyPadding: '20 20',
		header: false,
		width: 455,
		defaults: {
			margin: '5 0'
		},
		api: {
			submit: 'securityService.disableScreenLock'
		},
		paramsAsHash: true,

		cls: 'auth-dialog-login',
		defaultFocus: 'textfield[inputType=password]',
		layout: {
			type: 'vbox',
			align: 'stretch'
		},

		items: [ {
			xtype: 'label',
			text: i18n.auth_locked_text
		}, {
			xtype: 'textfield',
			hideLabel: true,
			height: 55,
			inputType: 'password',
			name: 'password',
			allowBlank: false,
			enableKeyEvents: true,
			triggers: {
				glyphed: {
					cls: 'trigger-glyph-noop password-trigger'
				}
			},
			listeners: {
				render: 'onPasswordRender',
				keypress: 'onPasswordKeypress',
				blur: 'onPasswordBlur'
			}
		}, {
			xtype: 'button',
			reference: 'resumeButton',
			scale: 'large',
			ui: 'soft-blue',
			iconAlign: 'right',
			iconCls: 'x-fa fa-angle-right',
			text: i18n.auth_locked_resume,
			formBind: true,
			listeners: {
				click: 'onLoginResumeButtonClick'
			}
		} ]

	} ]
});
