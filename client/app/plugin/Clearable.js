Ext.define('Starter.plugin.Clearable', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.clearable',

	config: {
		toggleEvent: 'change',
		weight: -100
	},

	init: function(field) {
		var plugin = this;
		var toggleEvent = field.clearableEvent || plugin.getToggleEvent();
		var weight = plugin.getWeight();

		// <debug>
		if (!field.isXType('textfield')) {
			Ext.Error.raise({
				msg: 'Ext.form.field.plugin.Clearable: This plugin is intended for usage with textfield-derived components',
				field: field,
				fieldXtypes: field.getXTypes()
			});
		}
		// </debug>

		field.setTriggers(Ext.applyIf(field.getTriggers(), {
			clear: {
				cls: Ext.baseCSSPrefix + 'form-clear-trigger',
				weight: weight,
				handler: function() {
					if (Ext.isFunction(field.clearValue)) {
						field.clearValue();
					}
					else {
						field.setValue(null);
					}
					field.getTrigger('clear').hide();
				},
				hidden: !field.getValue()
			}
		}));

		field.on('render', function() {
			var listeners = {
				destroyable: true
			};

			listeners[toggleEvent] = function(field) {
				var fieldValue = field.getValue();
				var hasValue = false;

				switch (field.getXType()) {
				case 'numberfield':
					hasValue = fieldValue !== null;
					break;
				default:
					hasValue = fieldValue;
				}

				field.getTrigger('clear')[hasValue ? 'show' : 'hide']();
			};

			field.clearableListeners = field.on(listeners);

		}, field, {
			single: true
		});

		Ext.Function.interceptAfter(field, 'setReadOnly', plugin.syncClearTriggerVisibility, plugin);
	},

	destroy: function() {
		var field = this.getCmp();
		if (field.clearableListeners) {
			field.clearableListeners.destroy();
		}
	},

	/**
	 * Considers all conditions to set trigger visibility. Can be overridden to influence
	 * when trigger is made visible.
	 */
	syncClearTriggerVisibility: function() {
		var field = this.getCmp();
		var value = field.getValue();
		var clearTrigger = field.getTrigger('clear');
		var isReadOnly = field.readOnly;

		clearTrigger[value && !isReadOnly ? 'show' : 'hide']();
	}
});