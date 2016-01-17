/**
 * This class provides the modal Ext.Window support for all Authentication forms. It's
 * layout is structured to center any Authentication dialog within it's center
 */
Ext.define('Starter.view.base.LockingWindow', {
	extend: 'Ext.window.Window',
	cls: 'auth-locked-window',

	closable: false,
	resizable: false,
	autoShow: true,
	titleAlign: 'center',
	maximized: true,
	modal: false,

	layout: {
		type: 'vbox',
		align: 'center',
		pack: 'center'
	}
});
