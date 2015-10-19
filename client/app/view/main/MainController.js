Ext.define('Starter.view.main.MainController', {
	extend: 'Ext.app.ViewController',

	// # = application
	// * = any controller
	listen: {
		controller: {
			'#': {
				unmatchedroute: 'handleUnmatchedRoute',
				pwreset: 'onPwReset'
			},
			'*': {
				signedin: 'onSignedIn',
				notsignedin: 'onNotSignedIn',
				logout: 'onLogout'
			}
		}
	},

	routes: {
		'auth.signin': {
			before: 'checkExistingSession',
			action: 'routeToAuthSignin'
		},

		'auth.:node': {
			action: 'routeToAuth',
			conditions: {
				':node': '(pwreset|pwresetconfirm|pwresetreq|signout|signin2fa)'
			}
		},

		':node': {
			before: 'checkSession',
			action: 'routeTo',
			conditions: {
				':node': '(?!auth.)([a-z\\.]+)'
			}
		}

	},

	onSignedIn: function(event, user) {
		var me = this;

		if (user.preAuth) {
			me.redirectTo('auth.signin2fa');
			return;
		}

		Starter.app.authUser = user;
		if (user.locale === 'de') {
			if (localStorage.starter_locale !== 'de') {
				localStorage.starter_locale = 'de';
				window.location.reload();
			}
			else {
				var script = document.createElement('script');
				var src = 'locale-de.js';
				if (Ext.manifest.loader.cache) {
					src += '?' + Ext.manifest.loader.cacheParam + '=' + Ext.manifest.loader.cache;
				}
				script.src = src;
				document.getElementsByTagName('head')[0].appendChild(script);
			}
		}
		else {
			if (localStorage.starter_locale !== 'en') {
				localStorage.starter_locale = 'en';
				window.location.reload();
			}
		}

		me.getViewModel().set('fullName', user.firstName + ' ' + user.lastName);

		if (localStorage.starter_navigation_micro === 'true') {
			this.onToggleNavigationSize();
		}
		
		var navigationStore = Ext.getStore('navigation');
		navigationStore.load({
			callback: function() {
				me.appready = true;
				me.fireEvent('appready', this);
				if (Starter.app.authUser) {
					if (Starter.app.authUser.screenLocked) {
						me.setCurrentView('auth.LockScreen', true);
						delete me.savedHash;
					}
					else if (me.savedHash) {
						me.redirectTo(me.savedHash);
						delete me.savedHash;
					}
					else {
						if (Starter.app.authUser.autoOpenView) {
							me.redirectTo(Starter.app.authUser.autoOpenView);
						}
					}

					me.enableLockscreen();
				}
			}
		});

		Ext.direct.Manager.on('exception', function(e) {
			if (e.message === 'accessdenied') {
				me.setCurrentView('main.Error403Window', true);
			}
			else {
				me.setCurrentView('main.Error500Window', true);
			}
		});

	},

	enableLockscreen: function() {
		var me = this;
		// Page will become idle after 1 hour
		ifvisible.setIdleDuration(3600);
		ifvisible.on("idle", function() {
			if (ifvisible.getIdleInfo().timeLeft === 0) {
				securityService.enableScreenLock(function() {
					me.setCurrentView('auth.LockScreen', true);
				});
			}
		});
		Ext.direct.Manager.getProvider('heartbeat').connect()
	},

	disableLockscreen: function() {
		ifvisible.off("idle");
		Ext.direct.Manager.getProvider('heartbeat').disconnect()
	},

	onNotSignedIn: function() {
		delete Starter.app.authUser;
		this.appready = true;
		this.fireEvent('appready', this);
		this.redirectTo('auth.signin');
	},

	onLogout: function() {
		var uri = window.location.toString();
		var cleanUri = uri.substring(0, uri.indexOf("?"));
		window.history.replaceState({}, document.title, cleanUri);

		delete Starter.app.authUser;
		this.appready = true;
		this.fireEvent('appready', this);
		this.redirectTo('auth.signout');
	},

	onResetRequestBeforeRender: function(form) {
		var key = 'starter_login';
		var val = sessionStorage.getItem(key);
		if (val) {
			sessionStorage.removeItem(key);
			form.down('textfield[name=email]').setValue(val);
		}
	},	
	
	onPwReset: function(e, token) {
		var uri = window.location.toString();
		var cleanUri = uri.substring(0, uri.indexOf("?"));
		window.history.replaceState({}, document.title, cleanUri);

		Starter.app.pwResetToken = token;

		this.appready = true;
		this.redirectTo('auth.pwreset');
	},

	routeToAuthSignin: function() {
		this.setCurrentView('auth.Signin', true);
	},

	routeToAuth: function(node) {
		switch (node) {
		case 'pwreset':
			this.setCurrentView('auth.PwReset', true);
			break;
		case 'pwresetconfirm':
			this.setCurrentView('auth.PwResetConfirm', true);
			break;
		case 'pwresetreq':
			this.setCurrentView('auth.PwResetReq', true);
			break;
		case 'signout':
			this.setCurrentView('auth.Signout', true);
			break;
		case 'signin2fa':
			this.setCurrentView('auth.SigninTwoFa', true);
			break;
		}
	},

	routeTo: function(node) {
		if (node === 'userconfig') {
			this.setCurrentView('userconfig.Panel', true);
		}
		else {
			this.setCurrentView(node);
		}
	},

	checkExistingSession: function(action) {
		if (!this.appready) {
			this.on('appready', Ext.Function.bind(this.checkExistingSession, this, arguments), this, {
				single: true
			});
		}
		else {
			if (Starter.app.authUser) {
				if (Starter.app.authUser.autoOpenView) {
					action.stop();
					this.redirectTo(Starter.app.authUser.autoOpenView);
				}
				else {
					action.resume();
				}
			}
			else {
				action.resume();
			}
		}
	},

	checkSession: function(node, action) {
		if (!this.appready) {
			this.savedHash = node;
			this.on('appready', Ext.Function.bind(this.checkSession, this, arguments), this, {
				single: true
			});
		}
		else {
			if (Starter.app.authUser) {
				action.resume();
			}
			else {
				this.savedHash = node;
				action.stop();
				this.redirectTo('auth.signin');
			}
		}
	},

	handleUnmatchedRoute: function(node) {
		if (node !== '') {
			this.setCurrentView('main.Error404Window', true);
		}
	},

	setCurrentView: function(hashTag, internal) {
		var view;
		var navigationTreeList = this.lookup('navigationTreeList');

		if (!internal) {
			var navigationStore = Ext.getStore('navigation');
			var node = navigationStore.findNode('routeId', hashTag);
			if (node) {
				navigationTreeList.setSelection(node);
				view = node.get('view');
			}
			else {
				navigationTreeList.setSelection(null);
				view = null;
			}
		}
		else {
			navigationTreeList.setSelection(null);
			view = hashTag;
		}

		// Kill any previously routed window
		var lastView = this.getViewModel().get('currentView');
		if (lastView && lastView.isWindow) {
			lastView.destroy();
		}

		var mainCardPanel = this.lookup('mainCardPanel');
		var mainLayout = mainCardPanel.getLayout();

		var existingItem = mainCardPanel.child('component[routeId=' + hashTag + ']');
		var newView;

		if (!existingItem) {
			newView = Ext.create('Starter.view.' + (view || 'main.Error404Window'), {
				hideMode: 'offsets',
				routeId: hashTag
			});

			if (!newView.isWindow) {
				Ext.suspendLayouts();
				mainLayout.setActiveItem(mainCardPanel.add(newView));
				Ext.resumeLayouts(true);
			}
		}
		else {
			if (existingItem !== mainLayout.getActiveItem()) {
				mainLayout.setActiveItem(existingItem);
			}
			newView = existingItem;
		}

		if (newView.isFocusable(true)) {
			newView.focus();
		}

		this.getViewModel().set('currentView', newView);

	},

	onLogoutClick: function() {
		var me = this;
		Ext.Ajax.request({
			url: serverUrl + 'logout',
			method: 'POST'
		}).then(function(r) {
			var currentLocation = window.location.toString();
			var hashPos = currentLocation.indexOf("#");
			if (hashPos > 0) {
				currentLocation = currentLocation.substring(0, hashPos) + '?logout';
			}
			else {
				currentLocation += '?logout';
			}
			window.location.replace(currentLocation);
		});

	},

	onNavigationTreeSelectionChange: function(tree, node) {
		if (node && node.get('view')) {
			// cleanup mainCardPanel
			var mainCardPanel = this.lookup('mainCardPanel');
			mainCardPanel.removeAll();

			this.redirectTo(node.get("routeId"));
		}
	},

	onToggleNavigationSize: function() {
		var me = this, 
		    refs = me.getReferences(), 
		    navigationList = refs.navigationTreeList, 
		    wrapContainer = refs.mainContainer, 
		    collapsing = !navigationList.getMicro(), 
		    new_width = collapsing ? 64 : 250;

		localStorage.starter_navigation_micro = collapsing;
		
		if (Ext.isIE9m || !Ext.os.is.Desktop) {
			Ext.suspendLayouts();

			refs.appLogo.setWidth(new_width);

			navigationList.setWidth(new_width);
			navigationList.setMicro(collapsing);

			Ext.resumeLayouts(); // do not flush the layout here...

			// No animation for IE9 or lower...
			wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
			wrapContainer.updateLayout(); // ... since this will flush them
		}
		else {
			if (!collapsing) {
				// If we are leaving micro mode (expanding), we do that first so that the
				// text of the items in the navlist will be revealed by the animation.
				navigationList.setMicro(false);
			}

			// Start this layout first since it does not require a layout
			refs.appLogo.animate({
				dynamic: true,
				to: {
					width: new_width
				}
			});

			// Directly adjust the width config and then run the main wrap container
			// layout
			// as the root layout (it and its chidren). This will cause the adjusted size
			// to
			// be flushed to the element and animate to that new size.
			navigationList.width = new_width;
			wrapContainer.updateLayout({
				isRoot: true
			});

			// We need to switch to micro mode on the navlist *after* the animation (this
			// allows the "sweep" to leave the item text in place until it is no longer
			// visible.
			if (collapsing) {
				navigationList.on({
					afterlayoutanimation: function() {
						navigationList.setMicro(true);
					},
					single: true
				});
			}
		}

	}

});
