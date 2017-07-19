Ext.define('Starter.Application', {
	extend: 'Ext.app.Application',
	requires: [ 'Ext.direct.*', 'Ext.form.action.DirectSubmit', 'Ext.state.Manager', 'Ext.state.LocalStorageProvider' ],
	name: 'Starter',

	stores: [ 'Navigation', 'Languages', 'Authority' ],

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

	constructor: function() {
		var heartbeat = new Ext.direct.PollingProvider({
			id: 'heartbeat',
			type: 'polling',
			interval: 5 * 60 * 1000, // 5 minutes
			url: serverUrl + POLLING_URLS.heartbeat
		});

		REMOTING_API.url = serverUrl + REMOTING_API.url;
		REMOTING_API.maxRetries = 0;

		Ext.direct.Manager.addProvider(REMOTING_API, heartbeat);
		Ext.direct.Manager.getProvider('heartbeat').disconnect();

		Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());

		this.callParent(arguments);
	},

	launch: function() {
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
