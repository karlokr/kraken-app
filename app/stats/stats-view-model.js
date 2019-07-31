const observableModule = require("tns-core-modules/data/observable");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
var statsService = require("~/services/stats-service");
const jsonB = require('./json_beautifier.js');
const topmost = require("tns-core-modules/ui/frame").topmost;
const dialogsModule = require("tns-core-modules/ui/dialogs");
var listview = require("tns-core-modules/ui/list-view");
const labelModule = require("tns-core-modules/ui/label");
const gridlayout = require("tns-core-modules/ui/layouts/grid-layout");

function StatsViewModel(args) {
	var viewModel = observableModule.fromObject({
		page: args,
		stat: "weight",
		title: "Weight",
		unit: "kg",
		stats: ["weight", "chest", "arms", "waist", "hips", "butt"],
		graphStats: [],
		graphBestFit: [],
		graphMin: 0,
		graphMax: 1,
		items: new ObservableArray(),
		week: 0,
		switchStat: function (args) {
			viewModel.set("graphMin", 0);
			viewModel.set("graphMax", 1);
			for (x in viewModel.stats) {
				viewModel.page.getViewById(this.stats[x]).borderWidth = "2px";
			}
			const menuButtonParent = args.object.parent;
			var btn = args.object;
			var stat = menuButtonParent.get("data-name");
			btn.borderWidth = "4px";
			viewModel.set("stat", stat);
			viewModel.set("title", this.capitalizeFirst(stat));
			this.stat == "weight" ? this.unit = "kg" : this.unit = "inches";
			this.getGraphStats();
			viewModel.page.getViewById("container").removeChildren();
			viewModel.set("week", 0);
			this.getListView();
			setTimeout(() => {
				this.getListView();
			}, 20);
		},
		getListView() {
			statsService.getListView({
				stat: this.stat,
				week: String(this.week)
			}).then(function (data) {
				var ListVw = new listview.ListView();
				var stcklayout = new gridlayout.GridLayout();
				stcklayout.id = data.week;
				stcklayout.backgroundColor = "#3E646C";
				stcklayout.padding = "10";
				stcklayout.paddingLeft = "15";
				stcklayout.paddingRight = "15";
				stcklayout.rows = "auto";
				stcklayout.columns = "*";
				//stcklayout.orientation = "horizontal";
				const heading = new labelModule.Label();
				const avg = new labelModule.Label();
				heading.text = "Week " + data.week;
				heading.color = "white";
				avg.row = "0";
				avg.horizontalAlignment = "right";
				avg.textAlignment = "right";
				avg.color= "white";
				avg.text = Math.round( data.avg * 10 ) / 10 + " " + viewModel.get("unit") + " avg"
				ListVw.items = [];
				ListVw.className = "list-group";
				ListVw.height = 50 * data.stats.length + 1 * data.stats.length;
				ListVw.itemTemplate = '<GridLayout class="list-group-item" rows="auto" columns="auto, *">  <StackLayout row="0" col="1" orientation="horizontal"> <Label text="{{ date }}" class="list-group-item-heading" /> <Label text="{{ weight }}" class="list-group-item-text" /> </StackLayout> </GridLayout>';

				for (var i = data.stats.length - 1; i >= 0; i--) {
					ListVw.items.push(data.stats[i]);
				}
				viewModel.page.getViewById("container").addChild(stcklayout);
				viewModel.page.getViewById(data.week).addChild(heading);
				viewModel.page.getViewById(data.week).addChild(avg);
				viewModel.page.getViewById("container").addChild(ListVw);
			})
			this.week++;
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
				//console.log(data);

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
		},
		onNavBtnTap() {
			topmost().navigate({
				moduleName: "home/home-page",
				clearHistory: true
			});
		},
		addStat() {
			dialogsModule.prompt({
				title: "Enter todays " + this.stat + " measurement",
				message: "Please enter the measurement in " + this.unit,
				inputType: dialogsModule.inputType.decimal,
				defaultText: "",
				okButtonText: "Ok",
				cancelButtonText: "Cancel"
			}).then((data) => {
				if (data.result) {
					statsService.insertStat({
						stat: this.stat,
						measurement: data.text
					}).then(() => {
						this.getGraphStats();
					}).catch(() => {
						alert("Unfortunately, an error occurred resetting your password.");
					});
				}
			});
		}
	})

	// Run on page load:
	viewModel.getListView();
	viewModel.getGraphStats();
	setTimeout(() => {
		viewModel.getListView();
	}, 100);

	viewModel.page.getViewById("weight").borderWidth = "4px";

	return viewModel;
}

module.exports = StatsViewModel;