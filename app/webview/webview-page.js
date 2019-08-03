// >> web-view-src-local-file
const Observable = require("tns-core-modules/data/observable").Observable;
const webViewModule = require("tns-core-modules/ui/web-view");
var appSettings = require("tns-core-modules//application-settings");
const topmost = require("tns-core-modules/ui/frame").topmost;


function onNavigatingTo(args) {
    const page = args.object;
    const vm = new Observable();
    page.bindingContext = vm;
}

function onFirstWebViewLoaded(webargs) {
    const page = webargs.object.page;
    const vm = page.bindingContext;
    const webview = webargs.object;

    vm.set("url", appSettings.getString("url"));
    vm.set("url_title", appSettings.getString("url_title"));
    vm.set("resultFirstWebView", "First WebView is still loading...");
    // handling WebView load finish event
    webview.on(webViewModule.WebView.loadFinishedEvent, (args) => {
        let message = "";
        if (!args.error) {
            message = `First WebView finished loading of ${args.url}`;
            console.log(args);
        } else {
            message = `Error loading first WebView ${args.url} : ${args.error}`;
        }

    });
}

exports.onNavBtnTap = function () {
    topmost().navigate({
        moduleName: "home/home-page",
        clearHistory: true
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onFirstWebViewLoaded = onFirstWebViewLoaded;
// << web-view-src-local-file