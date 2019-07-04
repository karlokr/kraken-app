var observableModule = require("tns-core-modules/data/observable");
const Observable = require("tns-core-modules/data/observable").Observable;
var dialogs = require("tns-core-modules/ui/dialogs");


var viewModel = new Observable();

function HomeViewModel() {

	viewModel.page_change = function () {
		topmost().navigate("./new-folder/new-page");
	}

	viewModel.set("dialogOpen", false);
	viewModel.set("calories_data", [
		{ day: "Mon", count: 204 },
		{ day: "Tue", count: 302 },
		{ day: "Wed", count: 130 },
		{ day: "Thu", count: 144 },
		{ day: "Fri", count: 210 },
		{ day: "Sat", count: 106 },
		{ day: "Sun", count: 156 }
	]);
	viewModel.showDialog = function () {
		viewModel.set("dialogOpen", true);
	}
	viewModel.closeDialog = function () {
		viewModel.set("dialogOpen", false);
	}
	viewModel.submenu = function () {
		dialogs.alert({
			title: "Silence is Golden",
			okButtonText: "OK"
		});
	}
	viewModel.set("categoricalSource", [
		{ Category: "Mar", Amount: 51 },
		{ Category: "Apr", Amount: 81 },
		{ Category: "May", Amount: 89 },
		{ Category: "Jun", Amount: 97 }
	]);

	viewModel.set("areaSource2", [
		{ Category: "Mar", Amount: 60 },
		{ Category: "Apr", Amount: 87 },
		{ Category: "May", Amount: 91 },
		{ Category: "Jun", Amount: 95 }
	]);



	return viewModel;
}

module.exports = HomeViewModel;

