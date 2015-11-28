Ext.define("Starter.ErrorLogger", {
	singleton: true,
	// Log only one error per page visit
	maxNbrLogs: 1,
	nbrErrorsLogged: 0,

	constructor: function() {
		window.onerror = Ext.Function.bind(this.onError, this);
	},

	onError: function(message, file, line, column, errorObj) {
		if (!logService) {
			return;
		}		
		
		var win = window, d = document;

		if (!message || message.match('chrome://') || message.match('Script error')) {
			return;
		}

		if (this.nbrErrorsLogged < this.maxNbrLogs && message && (line || file)) {
			this.nbrErrorsLogged++;

			var windowWidth = win.innerWidth 
				|| d.documentElement.clientWidth 
				|| d.body.clientWidth, windowHeight = win.innerHeight 
				|| d.documentElement.clientHeight 
				|| d.body.clientHeight;

			var crashData = {
				msg: message,
				url: file,
				line: line,
				href: win.location.href,
				windowWidth: windowWidth,
				windowHeight: windowHeight,
				extVersion: Ext.versions && Ext.versions.extjs && Ext.versions.extjs.version,
				localDate: new Date().toString(),
				column: column || '',
				stack: (errorObj && errorObj.stack) || ''
			};

			logService.logClientCrash(crashData);
		}
	}
});