const observableModule = require("tns-core-modules/data/observable");
const topmost = require("tns-core-modules/ui/frame").topmost;
var appSettings = require("tns-core-modules/application-settings");

function HomeViewModel(userInfo) {
    const viewModel = observableModule.fromObject({
        loggedUser: appSettings.getString("firstName"),

        logout: function () {
            // TODO
        },

        onMenuButtonTap: function (args) {
            // Navigate to corresponding page
            console.log("first press or second");
            const menuButtonParent = args.object.parent;
            appSettings.setString("url", menuButtonParent.get("data-name"));
            appSettings.setString("url_title", menuButtonParent.get("id"));
            topmost().navigate({
                moduleName: "webview/webview-page"
            });
        },

        onProfileButtonTap: function () {
            // Navigate to profile page here
            alert("Navigate to profile page");
        },

        onStatsTap: function (args) {
            topmost().navigate({
                moduleName: "stats/stats-page",
            });
        },

        onPhotosTap: function (args) {
            topmost().navigate({
                moduleName: "progress/main-page",
            });
        }
    });

    return viewModel;
}




module.exports = HomeViewModel;