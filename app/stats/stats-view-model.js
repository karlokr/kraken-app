const observableModule = require("tns-core-modules/data/observable");
var statsService = require("~/services/stats-service");
const jsonB = require('./json_beautifier.js');

function StatsViewModel(args) {
	var viewModel = observableModule.fromObject({
		stat: "weight",
		title: "Weight",
		graphStats: "",
		switchStat: function (args) {
			const menuButtonParent = args.object.parent;
			var stat = menuButtonParent.get("data-name");
			viewModel.set("stat", stat);
			viewModel.set("title", this.capitalizeFirst(stat));
		},
		getGraphStats() {
			statsService.getGraphStats({
				stat: this.stat
			}).then(function (data) {
				properJSON = jsonB(data, {dropQuotesOnNumbers: true, dropQuotesOnKeys: true, minify: true});
				console.log(properJSON);
				viewModel.set("graphStats", data);
			})
		},
		capitalizeFirst(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
	})

	// Run on page load:
	viewModel.getGraphStats();

	return viewModel;
}

module.exports = StatsViewModel;
