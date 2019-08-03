const LoginViewModel = require("./login-view-model");
const loginViewModel = new LoginViewModel();
var orientation = require('nativescript-orientation');
var appSettings = require("tns-core-modules/application-settings");
const topmost = require("tns-core-modules/ui/frame").topmost;
orientation.disableRotation();

exports.pageLoaded = function (args) {
    const page = args.object;
    page.bindingContext = loginViewModel;
    
}

exports.onNavigatingTo = function (args) {
    const page = args.object;
    if (appSettings.getString("email") != null && appSettings.getString("email") != undefined) {
        topmost().navigate({
            moduleName: "home/home-page",
            clearHistory: true
        });
    }
}