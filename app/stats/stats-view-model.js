const Observable = require("tns-core-modules/data/observable").Observable;
var statsService = require("~/services/stats-service");
const jsonB = require('./json_beautifier.js');

var viewModel = new Observable();

function StatsViewModel() {

	statsService.getGraphStats({
		stat: "weight"
	}).then(function (data) {
		properJSON = jsonB(data, {dropQuotesOnNumbers: true, dropQuotesOnKeys: true, minify: true});
		console.log(properJSON);
		viewModel.set("graphStats", data);
	})
	return viewModel;
}

module.exports = StatsViewModel;

// module.exports = pageLoaded;