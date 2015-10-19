Ext.define('Starter.data.validator.NotBlank', {
	extend: 'Ext.data.validator.Validator',
	alias: 'data.validator.notBlank',
	type: 'notBlank',

	config: {
		message: i18n.fieldrequired
	},

	validate: function(value) {

		if (value === undefined || value === null || Ext.String.trim(value).length === 0) {
			return this.getMessage();
		}

		return true;
	}
});