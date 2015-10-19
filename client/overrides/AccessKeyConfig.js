Ext.define('Starter.overrides.AccessKeyConfig', {
	override: 'Ext.Component',

	config: {
		accessKey: null
	},

	hookAfterRender: function() {
		delete this.afterRender;
		this.afterRender();

		this.updateAccessKey(this.getAccessKey());
	},

	updateAccessKey: function(key) {
		if (this.rendered) {
			var focusEl = this.getFocusEl();
			focusEl.dom.accessKey = key;
		}
		else {
			this.afterRender = this.hookAfterRender;
		}
	}
});