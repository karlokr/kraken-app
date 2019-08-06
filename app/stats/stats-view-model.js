const observableModule = require("tns-core-modules/data/observable");
var appSettings = require("tns-core-modules/application-settings");
var statsService = require("~/services/stats-service");
const jsonB = require('./json_beautifier.js');
const topmost = require("tns-core-modules/ui/frame").topmost;
const dialogsModule = require("tns-core-modules/ui/dialogs");
var listview = require("tns-core-modules/ui/list-view");
const labelModule = require("tns-core-modules/ui/label");
const gridlayout = require("tns-core-modules/ui/layouts/grid-layout");
var moment = require('moment');
const modalViewModule = "modal/modal-page";

function StatsViewModel(args) {
	var viewModel = observableModule.fromObject({
		page: args,
		stat: "weight",
		title: "Weight",
		unit: "",
		stats: ["weight", "chest", "arms", "waist", "hips", "butt"],
		graphStats: [],
		graphBestFit: [],
		graphMin: 0,
		graphMax: 1,
		week: 0,
		lastItemY: 0,
		firstItem: true,
		listEntries: 0,
		weekArrays: [],
		switchStat: function (args) {
			viewModel.set("graphMin", 0);
			viewModel.set("graphMax", 1);
			viewModel.set("firstItem", true);
			viewModel.set("listEntries", 0);
			for (x in viewModel.stats) {
				viewModel.page.getViewById(this.stats[x]).borderWidth = "2px";
			}
			const menuButtonParent = args.object.parent;
			var btn = args.object;
			var stat = menuButtonParent.get("data-name");
			btn.borderWidth = "4px";
			viewModel.set("stat", stat);
			viewModel.set("title", this.capitalizeFirst(stat));
			if (viewModel.get("stat") == "weight") {
				appSettings.getBoolean("weightUnit") ? this.unit = "kg" : this.unit = "lbs";
			} else {
				appSettings.getBoolean("lengthUnit") ? this.unit = "cm" : this.unit = "inches";
			}
			viewModel.page.getViewById("container").removeChildren();
			viewModel.set("week", 0);
			this.loadItems();
		},
		getListView(weekno) {
			statsService.getListView({
				stat: this.stat,
				week: String(this.week)
			}).then(function (data) {
				viewModel.set("listEntries", data.stats.length + viewModel.get("listEntries"));

				// get the calendar range of the week number
				getDateFromWeek = function (week, year) {
					return moment(year).add(week, 'weeks').startOf('week').format('MMM DD') + " - " + moment(year).add(week, 'weeks').endOf('week').format('MMM DD')
				};
				var year = new Date(data.stats[data.stats.length - 1].date + "Z");
				var yearno = year.getFullYear();
				if (viewModel.get("firstItem") && weekno == 0) {
					data.weekDisplay = "THIS WEEK";
					viewModel.set("firstItem", false)
				} else {
					data.weekDisplay = getDateFromWeek(String(data.week), String(yearno));
				}

				// replace stat key (eg, weight, arms, etc) with "stat"
				for (var i = 0; i < data.stats.length; i++) {
					var element = data.stats[i];
					var val = element[viewModel.get("stat")];
					if (viewModel.get("stat") == "weight") {

						appSettings.getBoolean("weightUnit") ? element.stat = Math.round(val * 10) / 10 : element.stat = Math.round(val * 2.20462262 * 10) / 10;
					} else {
						appSettings.getBoolean("lengthUnit") ? element.stat = Math.round(val * 2.54 * 10) / 10 : element.stat = Math.round(val * 10) / 10;
					}

					var utcTime = new Date(data.stats[i].date + "Z");
					var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
					// var localText = days[utcTime.getDay()] + ". " + utcTime.getHours() + ":" + ('0'+utcTime.getMinutes()).slice(-2);
					data.stats[i].day = days[utcTime.getDay()] + ". ";
					data.stats[i].time = ('0' + utcTime.getHours()).slice(-2) + ":" + ('0' + utcTime.getMinutes()).slice(-2);
				}

				viewModel.weekArrays.push(data);
				// generate listview
				viewModel.generateListView(viewModel.weekArrays.length - 1);
			})
			this.week++;

		},
		openModal(args) {
			const mainView = args.object;
			const option = {
				context: {
					weightUnit: appSettings.getBoolean("weightUnit"), // true = kg
					lengthUnit: appSettings.getBoolean("lengthUnit") // true = cm
				},
				closeCallback: () => {
					if (viewModel.get("stat") == "weight") {

						appSettings.getBoolean("weightUnit") ? viewModel.set("unit", "kg") : viewModel.set("unit", "lbs");
					} else {
						appSettings.getBoolean("lengthUnit") ? viewModel.set("unit", "cm") : viewModel.set("unit", "inches");
					}
					viewModel.page.getViewById("container").removeChildren();
					viewModel.set("week", 0);
					viewModel.set("firstItem", true);
					viewModel.set("listEntries", 0);
					this.loadItems();
				},
				// closeCallback: (username, password) => {
				//     // Receive data from the modal view. e.g. username & password
				//     alert(`Username: ${username} : Password: ${password}`);
				// },
				fullscreen: false
			};
			mainView.showModal(modalViewModule, option);
		},
		generateListView(index) {
			var ListVw = new listview.ListView();
			var stcklayout = new gridlayout.GridLayout();
			stcklayout.id = viewModel.weekArrays[index].week;
			stcklayout.backgroundColor = "#3E646C";
			stcklayout.padding = "10";
			stcklayout.paddingLeft = "15";
			stcklayout.paddingRight = "15";
			stcklayout.rows = "auto";
			stcklayout.columns = "*";
			const heading = new labelModule.Label();
			const avg = new labelModule.Label();
			heading.text = viewModel.weekArrays[index].weekDisplay;
			heading.color = "white";
			avg.row = "0";
			avg.horizontalAlignment = "right";
			avg.textAlignment = "right";
			avg.color = "white";
			var avgText = "";
			if (viewModel.get("stat") == "weight") {

				appSettings.getBoolean("weightUnit") ? avgText = Math.round(viewModel.weekArrays[index].avg  * 10) / 10 : avgText = Math.round(viewModel.weekArrays[index].avg  * 2.20462262 *  10) / 10;
			} else {
				appSettings.getBoolean("lengthUnit") ? avgText = Math.round(viewModel.weekArrays[index].avg * 2.54 * 10) / 10 : avgText = Math.round(viewModel.weekArrays[index].avg * 10) / 10;
			}
			avg.text = avgText + " " + viewModel.get("unit") + " avg"
			ListVw.items = [];
			ListVw.className = "list-group";
			ListVw.height = 52 * viewModel.weekArrays[index].stats.length + 1 * viewModel.weekArrays[index].stats.length;
			ListVw.itemTemplate = '<GridLayout class="list-group-item" rows="auto" columns="auto, *">' +
				'<GridLayout rows="auto,*" columns="*" row="0" col="1">' +
				'<StackLayout row="0" horizontalAlignment="left" orientation="horizontal">' +
				'<Label text="{{ day }}" class="list-group-item-heading" horizontalAlignment="left" />' +
				'<Label text="{{ time }}" class="list-group-item-heading-time" horizontalAlignment="left" />' +
				'</StackLayout>' +
				'<StackLayout row="0" horizontalAlignment="right" orientation="horizontal">' +
				'<Label  text="{{ stat }}" class="list-group-item-text-stat"/>' +
				'<Label  text=" ' + viewModel.unit + '" class="list-group-item-text-unit"/>' +
				'</StackLayout>' +
				'</GridLayout> </GridLayout>';

			for (var j = viewModel.weekArrays[index].stats.length - 1; j >= 0; j--) {
				ListVw.items.push(viewModel.weekArrays[index].stats[j]);
			}
			viewModel.page.getViewById("container").addChild(stcklayout);
			viewModel.page.getViewById(viewModel.weekArrays[index].week).addChild(heading);
			viewModel.page.getViewById(viewModel.weekArrays[index].week).addChild(avg);
			viewModel.page.getViewById("container").addChild(ListVw);
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
					console.log(inner[1]);
					if (viewModel.get("stat") == "weight") {
						appSettings.getBoolean("weightUnit") ? data[key][inner[1]]  = Math.round(data[key][inner[1]]  * 10) / 10 : data[key][inner[1]]  = Math.round(data[key][inner[1]]   * 2.20462262 *  10) / 10;
					} else {
						appSettings.getBoolean("lengthUnit") ? data[key][inner[1]]  = Math.round(data[key][inner[1]]  * 2.54 * 10) / 10 : data[key][inner[1]]  = Math.round(data[key][inner[1]]  * 10) / 10;
					}
				}
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

				//get the time between dates in seconds
				var t = [];
				for (var i = 0; i < dates.length; i++) {
					var seconds = 0;
					if (i == 0) {
						seconds = 0;
						t.push(seconds);
					} else {
						seconds = (dates[i] - dates[0]) / 1000;
						t.push(seconds);
					}

				}
				x = t;
				if (max + 3 < viewModel.get("graphMin")) {
					viewModel.set("graphMin", min - 3);
					viewModel.set("graphMax", max + 3);
					
				} else {
					viewModel.set("graphMax", max + 3);
					viewModel.set("graphMin", min - 3);
				}
				

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
		loadItems() {
			this.getGraphStats();

			function accumulatorListView(nextID) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						viewModel.getListView(viewModel.get("week"));
						resolve();
					}, 100);
				});
			}

			[1, 2].reduce((accumulatorPromise, nextID) => {
				return accumulatorPromise.then(() => {
					return accumulatorListView(nextID);
				});
			}, Promise.resolve());

			setTimeout(() => {
				if (viewModel.get("listEntries") < 6) {
					[1, 2].reduce((accumulatorPromise, nextID) => {
						return accumulatorPromise.then(() => {
							return accumulatorListView(nextID);
						});
					}, Promise.resolve());
				}
			}, 1000);
		},
		onNavBtnTap() {
			topmost().navigate({
				moduleName: "home/home-page",
				clearHistory: true
			});
		},
		onLayoutChanged(event) {
			const containerLyt = viewModel.page.getViewById("scroller");
			var verticalOffset = containerLyt.scrollableHeight;
			this.lastItemY = verticalOffset
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
					var statEntry;
					console.log(this.stat);
					if (viewModel.get("stat") == "weight") {
						viewModel.get("unit") == "kg" ? statEntry = data.text  : statEntry = data.text / 2.20462262;
					} else {
						viewModel.get("unit") == "inches"  ? statEntry = data.text  : statEntry = data.text * 0.3937007874;
					}
					statsService.insertStat({
						stat: this.stat,
						measurement: statEntry
					}).then(() => {
						viewModel.page.getViewById("container").removeChildren();
						viewModel.set("week", 0);
						viewModel.set("firstItem", true);
						viewModel.set("listEntries", 0);
						this.loadItems();
					}).catch(() => {
						//alert("Unfortunately, an error occurred resetting your password.");
					});
				}
			});
		}
	})

	// Run on page load:
	viewModel.page.getViewById("weight").borderWidth = "4px";
	if (viewModel.get("stat") == "weight") {
		appSettings.getBoolean("weightUnit") ? viewModel.unit = "kg" : viewModel.unit = "lbs";
	} else {
		appSettings.getBoolean("lengthUnit") ? viewModel.unit = "cm" : viewModel.unit = "inches";
	}
	viewModel.loadItems();
	return viewModel;
}

module.exports = StatsViewModel;