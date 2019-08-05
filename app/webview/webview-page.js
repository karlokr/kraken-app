// >> web-view-src-local-file
const Observable = require("tns-core-modules/data/observable").Observable;
const webViewModule = require("tns-core-modules/ui/web-view");
var appSettings = require("tns-core-modules//application-settings");
const topmost = require("tns-core-modules/ui/frame").topmost;
const dialogs = require("tns-core-modules/ui/dialogs");
const application = require("tns-core-modules/application");
var myPage;


function onFirstWebViewLoaded(webargs) {
    const page = webargs.object.page;
    const vm = page.bindingContext;
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }

}
exports.pageLoaded = function (args) {
    const page = args.object.page;
    const vm = page.bindingContext;
    myPage = page;
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
};
exports.pageUnloaded = function () {
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
};

function backEvent(args) {
    const webView = myPage.getViewById("myWebView");
    if (webView.canGoBack) {
        args.cancel = true;
        webView.goBack();
    } 
}

function onNavigatingTo(args) {
    const page = args.object;
    const vm = new Observable();
    vm.set("url_title", appSettings.getString("url_title"));
    vm.set("webViewSrc", appSettings.getString("url"));
    vm.set("result", "");
    vm.set("tftext", appSettings.getString("url"));
    page.bindingContext = vm;
}
// handling WebView load finish event
function onWebViewLoaded(webargs) {
    const page = webargs.object.page;
    const vm = page.bindingContext;
    const webview = webargs.object;
    webView = webview;
    vm.set("result", "WebView is still loading...");
    vm.set("enabled", false);

    webview.on(webViewModule.WebView.loadFinishedEvent, (args) => {
        let message = "";
        if (!args.error) {
            message = `WebView finished loading of ${args.url}`;
        } else {
            message = `Error loading ${args.url} : ${args.error}`;
        }

        vm.set("result", message);
        console.log(`WebView message - ${message}`);
    });
}

function goBack(args) {
    const page = args.object.page;
    const vm = page.bindingContext;
    const webview = page.getViewById("myWebView");
    if (webview.canGoBack) {
        webview.goBack();
        vm.set("enabled", true);
    }
}

function goForward(args) {
    const page = args.object.page;
    const vm = page.bindingContext;
    const webview = page.getViewById("myWebView");
    if (webview.canGoForward) {
        webview.goForward();
    } else {
        vm.set("enabled", false);
    }
}

function submit(args) {
    const page = args.object.page;
    const vm = page.bindingContext;
    const textField = args.object;
    const text = textField.text;
    vm.set("enabled", false);
    if (text.substring(0, 4) === "http") {
        vm.set("webViewSrc", text);
        textField.dismissSoftInput();
    } else {
        dialogs.alert("Please, add `http://` or `https://` in front of the URL string")
            .then(() => {
                console.log("Dialog closed!");
            });
    }
}
exports.onNavigatingTo = onNavigatingTo;
exports.onWebViewLoaded = onWebViewLoaded;
exports.submit = submit;
exports.goBack = goBack;
exports.goForward = goForward;



exports.onNavBtnTap = function () {
    topmost().navigate({
        moduleName: "home/home-page",
        clearHistory: true
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onFirstWebViewLoaded = onFirstWebViewLoaded;
