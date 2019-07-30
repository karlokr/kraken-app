const LoginViewModel = require("./login-view-model");
const loginViewModel = new LoginViewModel();
var orientation = require('nativescript-orientation');
orientation.disableRotation();

exports.pageLoaded = function (args) {
    const page = args.object;
    page.bindingContext = loginViewModel;
}