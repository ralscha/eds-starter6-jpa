Ext.define('Starter.store.Languages', {
	extend: 'Ext.data.Store',
	storeId: 'languages',
	fields: [ 'value', 'text' ],

	data: [ {
		value: 'de',
		text: i18n.language_german
	}, {
		value: 'en',
		text: i18n.language_english
	} ]
});
