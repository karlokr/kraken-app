var StatsViewModel = require("./stats-view-model");


exports.pageLoaded = function(args) {
	const page = args.object;
	var statsViewModel = new StatsViewModel(page);
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

