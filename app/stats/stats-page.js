var frameModule = require("tns-core-modules/ui/frame");
var StatsViewModel = require("./stats-view-model");
var statsViewModel = new StatsViewModel();
var platform = require("platform");
var app = require("tns-core-modules/application");
var platform = require("platform");
var color = require("tns-core-modules/color");

function pageLoaded(args) {


	var page = args.object;

	page.bindingContext = statsViewModel;
// 	if (app.ios) {
// 		frameModule.topmost().ios.controller.navigationBar.barStyle = 1;
// 	}

// 	if (app.android && platform.device.sdkVersion >= '21') {
// 		var View = android.view.View;
// 		const window = app.android.foregroundActivity.getWindow();
// 		window.setStatusBarColor(new color.Color("#25325c").android);
// 	}
	
// // disable bounce on main scroll view
// 	var scrollView = page.getViewById('main_scroll');
// 	if (app.android) {
// 		scrollView.android.setOverScrollMode(2);
// 	}
// 	else if (app.ios) {
// 		scrollView.ios.bounces = false;
// 	}


}

exports.pageLoaded = pageLoaded;
