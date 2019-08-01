const application = require("tns-core-modules/application");
var appSettings = require("application-settings");

if (appSettings.getString("email") != null && appSettings.getString("email") != undefined) {
    application.start({
        moduleName: "home/home-page"
    });
} else {
    application.start({
        moduleName: "login/login-page"
    });
}


/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/