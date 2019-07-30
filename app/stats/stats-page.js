var StatsViewModel = require("./stats-view-model");
var orientation = require('nativescript-orientation');
orientation.disableRotation();

exports.pageLoaded = function(args) {
	const page = args.object;
	var statsViewModel = new StatsViewModel(page);
	page.bindingContext = statsViewModel;
}

