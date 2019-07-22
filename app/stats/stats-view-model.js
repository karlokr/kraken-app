const observableModule = require("tns-core-modules/data/observable");
var statsService = require("~/services/stats-service");
const jsonB = require('./json_beautifier.js');
var view = require("ui/core/view");

function StatsViewModel(args) {
	var viewModel = observableModule.fromObject({
		page: args,
		stat: "weight",
		title: "Weight",
		unit: "lbs",
		stats: ["weight", "chest", "arms", "waist", "hips", "butt"],
		graphStats: [],
		graphMin: 0,
		graphMax: 0,
		items: [],
		switchStat: function (args) {
			for (x in viewModel.stats) {
				viewModel.page.getViewById(this.stats[x]).borderWidth = "2px";
			}
			const menuButtonParent = args.object.parent;
			var btn = args.object;
			var stat = menuButtonParent.get("data-name");
			btn.borderWidth = "6px";
			viewModel.set("stat", stat);
			viewModel.set("title", this.capitalizeFirst(stat));
			this.stat == "weight" ? this.unit = "lbs" : this.unit = "cm";
			this.getGraphStats();
		},
		getGraphStats() {
			statsService.getGraphStats({
				stat: this.stat
			}).then(function (data) {
				properJSON = jsonB(data, {
					dropQuotesOnNumbers: true,
					dropQuotesOnKeys: true,
					minify: true
				});
				console.log(properJSON);
				var min = 1000;
				var max = 0;
				var keys = Object.keys(data);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					var inner = Object.keys(data[key]);
					var innerKey = inner[1];
					if (data[key][innerKey] < min) {
						min = data[key][innerKey]
					}
					if (data[key][innerKey] > max) {
						max = data[key][innerKey]
					}
				}
				console.log("min: " + min);
				console.log("max: " + max);
				viewModel.set("graphMin", min - 3);
				viewModel.set("graphMax", max + 3);
				viewModel.set("graphStats", data);
			})
		},
		capitalizeFirst(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}


	})

	// Run on page load:
	viewModel.getGraphStats();

	viewModel.page.getViewById("weight").borderWidth = "6px";

	viewModel.items.push({
		itemName: "Arcade Fire",
		itemDesc: "Funeral"
	}, {
		itemName: "Bon Iver",
		itemDesc: "For Emma, Forever Ago"
	}, {
		itemName: "Daft Punk",
		itemDesc: "Random Access Memories"
	}, {
		itemName: "Elbow",
		itemDesc: "Build a Rocket Boys!"
	}, {
		itemName: "Arcade Fire",
		itemDesc: "Funeral"
	}, {
		itemName: "Bon Iver",
		itemDesc: "For Emma, Forever Ago"
	}, {
		itemName: "Daft Punk",
		itemDesc: "Random Access Memories"
	}, {
		itemName: "Elbow",
		itemDesc: "Build a Rocket Boys!"
	})

	return viewModel;
}

module.exports = StatsViewModel;