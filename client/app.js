/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Starter.Application',

    name: 'Starter',

    requires: [
        // This will automatically load all classes in the Starter namespace
        // so that application classes do not need to require each other.
        'Starter.*'
    ],

    // The name of the initial view to create.
    mainView: 'Starter.view.main.Main'
});
