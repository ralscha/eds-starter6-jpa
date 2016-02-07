Ext.define('Starter.Application', {
	extend: 'Ext.app.Application',
	requires: [ 'Ext.direct.*', 'Ext.form.action.DirectSubmit', 'Starter.*', 'Ext.state.Manager', 'Ext.state.LocalStorageProvider', 'Ext.container.Container' ],
	name: 'Starter',

	stores: [ 'Navigation', 'Languages', 'Authority' ],

	constructor: function() {

		// start fix. isEqual is missing in current version
		Ext.Array.isEqual = function(a, b) {
			if (a === b) {
				return true;
			}
			if (a == null || b == null) {
				return false;
			}
			if (a.length != b.length) {
				return false;
			}

			for (var i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) {
					return false;
				}
			}
			return true;
		};
		// end fix

		// <debug>
		Ext.Ajax.on('beforerequest', function(conn, options, eOpts) {
			options.withCredentials = true;
		}, this);
		// </debug>

		var heartbeat = new Ext.direct.PollingProvider({
			id: 'heartbeat',
			type: 'polling',
			interval: 5 * 60 * 1000, // 5 minutes
			url: serverUrl + POLLING_URLS.heartbeat
		});

		REMOTING_API.url = serverUrl + REMOTING_API.url;

		Ext.direct.Manager.addProvider(REMOTING_API, heartbeat);
		Ext.direct.Manager.getProvider('heartbeat').disconnect();

		Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());

		this.callParent(arguments);
	},

	launch: function() {
		Ext.getBody().removeCls('loading');
		Ext.fly('loading_container').destroy();

		var me = this;
		var token = window.location.search.split('token=')[1];
		if (token) {
			me.fireEvent('pwreset', me, token);
		}
		else if (window.location.search === '?logout') {
			me.fireEvent('logout', me);
		}
		else {
			Starter.Util.getCsrfToken().then(function() {
				securityService.getAuthUser(function(user, e, success) {
					if (user) {
						me.fireEvent('signedin', me, user);
					}
					else {
						me.fireEvent('notsignedin', me);
					}
				});
			});

		}
	},

	onAppUpdate: function() {
		window.location.reload();
	}
});
