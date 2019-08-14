const application = require("tns-core-modules/application");
var appSettings = require("tns-core-modules/application-settings");


if (appSettings.getString("email") != null && appSettings.getString("email") != undefined) {
    application.run({
        moduleName: "app-home"
    });
} else {
    application.run({
        moduleName: "app-login"
    });
}





/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/