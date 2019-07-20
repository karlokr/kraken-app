const observableModule = require("tns-core-modules/data/observable");
var statsService = require("~/services/stats-service");
const jsonB = require('./json_beautifier.js');
var view = require("ui/core/view");

function StatsViewModel(args) {
	var viewModel = observableModule.fromObject({
		page: args,
		stat: "weight",
		title: "Weight",
		stats: ["weight", "chest", "arms", "waist", "hips", "butt"],
		graphStats: [],
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
			this.getGraphStats();
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

	viewModel.page.getViewById("weight").borderWidth = "6px";

	viewModel.items.push(
        {
            itemName: "Arcade Fire",
            itemDesc: "Funeral"
        },
        {
            itemName: "Bon Iver",
            itemDesc: "For Emma, Forever Ago"
        },
        {
            itemName: "Daft Punk",
            itemDesc: "Random Access Memories"
        },
        {
            itemName: "Elbow",
            itemDesc: "Build a Rocket Boys!"
		},
		{
            itemName: "Arcade Fire",
            itemDesc: "Funeral"
        },
        {
            itemName: "Bon Iver",
            itemDesc: "For Emma, Forever Ago"
        },
        {
            itemName: "Daft Punk",
            itemDesc: "Random Access Memories"
        },
        {
            itemName: "Elbow",
            itemDesc: "Build a Rocket Boys!"
        }
	)

	return viewModel;
}

module.exports = StatsViewModel;
