const observableModule = require("tns-core-modules/data/observable");
const topmost = require("tns-core-modules/ui/frame").topmost;
var utilityModule = require("utils/utils");
var appSettings = require("application-settings");

function HomeViewModel(userInfo) {
    const viewModel = observableModule.fromObject({
        loggedUser: appSettings.getString("firstName"),

        logout: function () {
            // Kinvey.User.logout()
            //     .then(() => {
            //         topmost().navigate({
            //             moduleName: "login/login-page",
            //             animated: true,
            //             transition: {
            //                 name: "slideTop",
            //                 duration: 350,
            //                 curve: "ease"
            //             }
            //         });
            //     });
        },

        onMenuButtonTap: function(args) {
            // Navigate to corresponding page
            const menuButtonParent = args.object.parent;
            utilityModule.openUrl(menuButtonParent.get("data-name"));
        },

        onProfileButtonTap: function() {
            // Navigate to profile page here
            alert("Navigate to profile page");
        },

        onStatsTap: function(args) {
            topmost().navigate({
                moduleName: "stats/stats-page",
            });
        },

        onPhotosTap: function(args) {
            topmost().navigate({
                moduleName: "progress/main-page",
            });
        }
    });

    return viewModel;
}

module.exports = HomeViewModel;
