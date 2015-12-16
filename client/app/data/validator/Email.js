Ext.define('Starter.data.validator.Email', {
	override: 'Ext.data.validator.Email',

	validate: function(value) {
		if (value === undefined || value === null || Ext.String.trim(value).length === 0) {
			return true;
		}
		var matcher = this.getMatcher(), result = matcher && matcher.test(value);
		return result ? result : this.getMessage();
	}
});