Ext.define('Starter.view.user.Form', {
	extend: 'Ext.form.Panel',
	requires: [ 'Ext.form.field.ComboBox', 'Ext.form.field.Tag' ],
	defaultFocus: 'textfield[name=loginName]',

	reference: 'editPanel',

	cls: 'shadow',
	defaultType: 'textfield',
	defaults: {
		anchor: '50%'
	},
	bodyPadding: 20,

	items: [ {
		name: 'loginName',
		allowBlank: false,
		fieldLabel: i18n.user_loginname
	}, {
		name: 'email',
		vtype: 'email',
		allowBlank: false,
		fieldLabel: i18n.user_email
	}, {
		name: 'firstName',
		allowBlank: false,
		fieldLabel: i18n.user_firstname
	}, {
		name: 'lastName',
		allowBlank: false,
		fieldLabel: i18n.user_lastname
	}, {
		xtype: 'combobox',
		fieldLabel: i18n.language,
		name: 'locale',
		store: 'languages',
		valueField: 'value',
		queryMode: 'local',
		emptyText: i18n.language_select,
		forceSelection: true,
		editable: false
	}, {
		fieldLabel: i18n.user_enabled,
		name: 'enabled',
		xtype: 'checkboxfield',
		msgTarget: 'side',
		inputValue: 'true',
		uncheckedValue: 'false'
	}, {
		xtype: 'tagfield',
		fieldLabel: i18n.user_authorities,
		store: 'authority',
		name: 'authorities',
		displayField: 'value',
		valueField: 'value',
		queryMode: 'local',
		forceSelection: true,
		autoSelect: true,
		editable: false,
		selectOnFocus: false,
		filterPickList: true
	} ],

	dockedItems: [ {
		xtype: 'toolbar',
		dock: 'top',
		items: [ {
			text: i18n.back,
			handler: 'back',
			iconCls: 'x-fa fa-arrow-left'
		}, {
			text: Starter.Util.underline(i18n.save, 'S'),
			accessKey: 's',
			ui: 'soft-green',
			iconCls: 'x-fa fa-floppy-o',
			formBind: true,
			handler: 'save'
		}, '-', {
			text: i18n.destroy,
			iconCls: 'x-fa fa-trash-o',
			handler: 'erase',
			ui: 'soft-red',
			bind: {
				hidden: '{isPhantomObject}'
			}
		}, {
			text: i18n.user_send_pwresetreq,
			iconCls: 'x-fa fa-envelope-o',
			handler: 'sendPwResetReq',
			bind: {
				hidden: '{isUserDisabled}'
			}
		}, {
			text: i18n.user_switchto,
			iconCls: 'x-fa fa-user-secret',
			handler: 'switchTo',
			bind: {
				hidden: '{isUserDisabled}'
			}
		}, {
			text: i18n.user_unlock,
			handler: 'unlock',
			iconCls: 'x-fa fa-unlock',
			bind: {
				hidden: '{!selectedObject.lockedOutUntil}'
			}
		}, {
			text: i18n.user_disable_twofactorauth,
			iconCls: 'x-fa fa-trash-o',
			handler: 'disableTwoFactorAuth',
			bind: {
				hidden: '{!selectedObject.twoFactorAuth}'
			}
		} ]
	} ]

});