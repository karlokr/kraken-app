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
		graphBestFit: [],
		graphMin: 0,
		graphMax: 1000,
		items: [],
		switchStat: function (args) {
			for (x in viewModel.stats) {
				viewModel.page.getViewById(this.stats[x]).borderWidth = "2px";
			}
			const menuButtonParent = args.object.parent;
			var btn = args.object;
			var stat = menuButtonParent.get("data-name");
			btn.borderWidth = "4px";
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

				//get the minimum and maximum value of the stat
				//for optimally displaying the stats graph
				var min = 1000;
				var max = 0;
				var x = [];
				var y = [];
				var dates = [];
				var keys = Object.keys(data);
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					var inner = Object.keys(data[key]);
					var innerKey = inner[1];
					//record the date as UTC
					dates.push(new Date(data[key][inner[0]] + "Z"));
					data[key][inner[0]] = new Date(data[key][inner[0]] + "Z");
					//find the min/max
					data[key][innerKey] < min ? min = data[key][innerKey] : min = min;
					data[key][innerKey] > max ? max = data[key][innerKey] : max = max;
					//collect data needed for the best fit
					x.push(i);
					y.push(data[key][innerKey]);
				}
				console.log(dates);
				viewModel.set("graphMax", max + 3);
				viewModel.set("graphMin", min - 3);
				
				viewModel.set("graphStats", data);

				//calculate the line of best fit for the stats data
				var sx = 0.0;
				var sy = 0.0;
				var stt = 0.0;
				var sts = 0.0;
				var n = x.length;
				for (var i = 0; i < n; i++) {
					sx += x[i];
					sy += y[i];
				}
				for (var i = 0; i < n; i++) {
					var t = x[i] - sx / n;
					stt += t * t;
					sts += t * y[i];
				}
				var slope = sts / stt;
				var intercept = (sy - sx * slope) / n;
				var bestFit = [];
				for (var i = 0; i < n; i++) {
					bestFit.push(slope * x[i] + intercept);
				}

				//build the JSON object of the best fit data for the viewmodel
				var jsonObj = {};
				var result = [];
				for (var i = 0; i < n; i++) {
					jsonObj = {};
					jsonObj.date = dates[i];
					jsonObj[viewModel.get("stat")] = bestFit[i];
					result.push(jsonObj);
				}
				viewModel.set("graphBestFit", result);
			})
		},
		capitalizeFirst(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
	})

	// Run on page load:
	viewModel.getGraphStats();

	viewModel.page.getViewById("weight").borderWidth = "4px";

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