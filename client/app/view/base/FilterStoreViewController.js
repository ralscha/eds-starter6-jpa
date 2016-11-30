Ext.define('Starter.view.base.FilterStoreViewController', {
	extend: 'Starter.view.base.ViewController',

	onObjectStoreLoad: function(store) {
		var count = store.count();
		var str;
		if (store.getTotalCount() !== count) {
			str = Ext.util.Format.plural(count, this.getObjectName(), this.getObjectNamePlural());
			str = str + ' (filtered, ' + store.getTotalCount() + ' unfiltered)';
		}
		else {
			str = Ext.util.Format.plural(count, this.getObjectName(), this.getObjectNamePlural());
		}
		this.getViewModel().set('totalCount', str);
	}

});