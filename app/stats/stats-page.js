var StatsViewModel = require("./stats-view-model");
var orientation = require('nativescript-orientation');
orientation.disableRotation();

exports.pageLoaded = function (args) {
	const page = args.object;
	var statsViewModel = new StatsViewModel(page);
	page.bindingContext = statsViewModel;
}

exports.onScroll = function (event) {
	const page = event.object.page;
	const vm = page.bindingContext;
	const scrollView = event.object,
		verticalOffset = scrollView.verticalOffset;
	if ( Math.abs(vm.lastItemY - verticalOffset) <= 10) {
		if (!vm.busy) {
			vm.busy = true;
			setTimeout(() => {
				vm.getListView();
				vm.busy = false;
			}, 20);
		}
		
	}
}