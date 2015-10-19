Ext.define('Starter.view.main.Error500Window', {
	extend: 'Starter.view.base.LockingWindow',

	cls: 'error-page-container',
	title: '<i class="x-fa fa-rocket"></i> ' + i18n.app_name + ': 500',

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
			cls: 'error-page-top-text',
			text: '500'
		}, {
			xtype: 'label',
			cls: 'error-page-desc',
			html: '<div>' + i18n.main_500_descr + '</div>'
		}, {
			xtype: 'label',
			cls: 'error-page-desc',
			html: '<div><a href="#auth.signin">' + i18n.main_backtohome + '</a></div>'
		} ]
	} ]
});
