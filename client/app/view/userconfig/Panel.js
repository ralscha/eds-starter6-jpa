Ext.define('Starter.view.userconfig.Panel', {
	extend: 'Ext.tab.Panel',

	controller: {
		xclass: 'Starter.view.userconfig.Controller'
	},

	viewModel: {
		xclass: 'Starter.view.userconfig.ViewModel'
	},

	defaultFocus: 'textfield[name=email]',
	cls: 'shadow',

	items: [ {
		xtype: 'form',
		title: i18n.userconfig_general,
		reference: 'userConfigForm',

		defaultType: 'textfield',
		defaults: {
			anchor: '50%'
		},
		padding: 5,
		bodyPadding: 20,

		modelValidation: true,

		items: [ {
			bind: '{user.loginName}',
			name: 'loginName',
			fieldLabel: i18n.user_loginname
		}, {
			bind: '{user.email}',
			name: 'email',
			fieldLabel: i18n.user_email
		}, {
			bind: '{user.firstName}',
			name: 'firstName',
			fieldLabel: i18n.user_firstname
		}, {
			bind: '{user.lastName}',
			name: 'lastName',
			fieldLabel: i18n.user_lastname
		}, {
			xtype: 'combobox',
			fieldLabel: i18n.language,
			bind: {
				value: '{user.locale}'
			},
			name: 'locale',
			store: 'languages',
			valueField: 'value',
			queryMode: 'local',
			emptyText: i18n.language_select,
			forceSelection: true,
			editable: false
		}, {
			xtype: 'tbseparator',
			height: 40
		}, {
			bind: '{user.currentPassword}',
			name: 'currentPassword',
			fieldLabel: i18n.userconfig_currentpassword,
			inputType: 'password'
		}, {
			bind: '{user.newPassword}',
			name: 'newPassword',
			fieldLabel: i18n.userconfig_newpassword,
			inputType: 'password',
			validator: function() {
				var newPasswordRetypeField = this.up().getForm().findField('newPasswordRetype');
				var newPasswordRetype = newPasswordRetypeField.getValue();
				var newPassword = this.getValue();
				if ((Ext.isEmpty(newPassword) && Ext.isEmpty(newPasswordRetype)) || (newPassword === newPasswordRetype)) {
					newPasswordRetypeField.clearInvalid();
					return true;
				}
				newPasswordRetypeField.markInvalid(i18n.userconfig_pwdonotmatch);
				return i18n.userconfig_pwdonotmatch;
			}
		}, {
			bind: '{user.newPasswordRetype}',
			name: 'newPasswordRetype',
			fieldLabel: i18n.userconfig_newpasswordretype,
			inputType: 'password',
			validator: function() {
				var newPasswordField = this.up().getForm().findField('newPassword');
				var newPassword = newPasswordField.getValue();
				var newPasswordRetype = this.getValue();
				if ((Ext.isEmpty(newPassword) && Ext.isEmpty(newPasswordRetype)) || (newPassword === newPasswordRetype)) {
					newPasswordField.clearInvalid();
					return true;
				}
				newPasswordField.markInvalid(i18n.userconfig_pwdonotmatch);
				return i18n.userconfig_pwdonotmatch;
			}
		} ],

		dockedItems: [ {
			xtype: 'toolbar',
			dock: 'top',
			items: [ {
				text: Starter.Util.underline(i18n.save, 'S'),
				accessKey: 's',
				ui: 'soft-green',
				iconCls: 'x-fa fa-floppy-o',
				formBind: true,
				handler: 'save'
			}, '-', {
				xtype: 'button',
				handler: 'clearState',
				ui: 'default-toolbar',
				text: i18n.userconfig_clear_state
			} ]
		} ]

	}, {
		xtype: 'panel',
		reference: 'twoFactorPanel',
		title: i18n.userconfig_2fa,
		layout: 'vbox',
		padding: 5,
		bodyPadding: 20,
		items: [ {
			xtype: 'label',
			cls: 'twofactor-info',
			html: i18n.userconfig_2fa_info + ' <span class="enabled">' + i18n.userconfig_2fa_info_enabled + '</span>',
			bind: {
				hidden: '{!user.twoFactorAuth}'
			}
		}, {
			xtype: 'label',
			cls: 'twofactor-info',
			html: i18n.userconfig_2fa_info + ' <span class="disabled">' + i18n.userconfig_2fa_info_disabled + '</span>',
			bind: {
				hidden: '{user.twoFactorAuth}'
			}
		}, {
			xtype: 'label',
			padding: '30 0 0 0',
			html: i18n.userconfig_2fa_secret,
			bind: {
				hidden: '{!secret}'
			}
		}, {
			xtype: 'label',
			padding: '5 0 0 0',
			cls: 'twofactor-secret',
			bind: {
				html: '{secret}',
				hidden: '{!secret}'
			}
		} ],

		dockedItems: [ {
			xtype: 'toolbar',
			dock: 'top',
			items: [ {
				text: i18n.userconfig_2fa_enable,
				ui: 'soft-green',
				iconCls: 'x-fa fa-lock',
				handler: 'enable2f',
				bind: {
					hidden: '{user.twoFactorAuth}'
				}
			}, {
				text: i18n.userconfig_2fa_disable,
				ui: 'soft-red',
				iconCls: 'x-fa fa-unlock',
				handler: 'disable2f',
				bind: {
					hidden: '{!user.twoFactorAuth}'
				}
			} ]
		} ]

	}, {
		xtype: 'grid',
		title: i18n.userconfig_plog,
		bind: '{persistentLogins}',
		autoLoad: true,

		columns: [ {
			text: i18n.userconfig_plog_ip,
			dataIndex: 'ipAddress',
			flex: 1
		}, {
			text: i18n.userconfig_plog_useragent,
			dataIndex: 'userAgentName',
			flex: 1
		}, {
			text: i18n.userconfig_plog_useragentversion,
			dataIndex: 'userAgentVersion',
			width: 100
		}, {
			text: i18n.userconfig_plog_operatingsystem,
			dataIndex: 'operatingSystem',
			width: 200
		}, {
			text: i18n.userconfig_plog_lastused,
			dataIndex: 'lastUsed',
			width: 170,
			xtype: 'datecolumn',
			format: 'Y-m-d H:i:s'
		}, {
			xtype: 'actioncolumn',
			sortable: false,
			hideable: false,
			width: 30,
			align: 'center',
			items: [ {
				iconCls: 'x-fa fa-trash',
				tooltip: i18n.destroy,
				handler: 'destroyPersistentLogin'
			} ]
		} ]
	} ]

});
