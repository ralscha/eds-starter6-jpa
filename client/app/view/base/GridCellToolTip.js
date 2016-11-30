Ext.define('Starter.view.base.GridCellToolTip', {
	extend : 'Ext.tip.ToolTip',

	delegate : '.x-grid-cell',
	width : 200,
	padding : 0,

	listeners : {
		beforeshow : function(tip) {
			var div = this.triggerElement.firstChild;
			if (div.scrollWidth <= div.clientWidth) {
				return false;
			}
			tip.setWidth(div.scrollWidth > 220 ? 220 : div.scrollWidth);
			tip.update(div.textContent);
		}
	}
});
