const frameModule = require("tns-core-modules/ui/frame");
const LoginViewModel = require("./login-view-model");

const loginViewModel = new LoginViewModel();

exports.pageLoaded = function (args) {
    const page = args.object;
    page.bindingContext = loginViewModel;
}
