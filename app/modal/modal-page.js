const observableModule = require("tns-core-modules/data/observable");
var appSettings = require("tns-core-modules/application-settings");
let closeCallback;

function onShownModally(args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = observableModule.fromObject(context);
}
exports.onShownModally = onShownModally;

function onCloseButtonTap(args) {
    const page = args.object.page;
    const bindingContext = page.bindingContext;
    // const username = bindingContext.get("username");
    // const password = bindingContext.get("password");
    // closeCallback(username, password);
    closeCallback();
}
exports.onCloseButtonTap = onCloseButtonTap;

function changeWeightUnit(args) {
    const page = args.object.page;
    const bindingContext = page.bindingContext;
    console.log("tapped");
    if (appSettings.getBoolean("weightUnit")) {
        appSettings.setBoolean("weightUnit", false);
        bindingContext.set("weightUnit", false)
    } else {
        appSettings.setBoolean("weightUnit", true);
        bindingContext.set("weightUnit", true)
    }
}

function changeLengthUnit(args) {
    const page = args.object.page;
    const bindingContext = page.bindingContext;
    console.log("tapped");
    if (appSettings.getBoolean("lengthUnit")) {
        appSettings.setBoolean("lengthUnit", false);
        bindingContext.set("lengthUnit", false)
    } else {
        appSettings.setBoolean("lengthUnit", true);
        bindingContext.set("lengthUnit", true)
    }
}

exports.changeWeightUnit = changeWeightUnit;
exports.changeLengthUnit = changeLengthUnit;
