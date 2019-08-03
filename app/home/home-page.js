const HomeViewModel = require("./home-view-model");
var orientation = require('nativescript-orientation');
const modalViewModule = "modal/modal-page";
orientation.disableRotation();

function onNavigatingTo(args) {
    const page = args.object;
    page.actionBarHidden = false;
    page.bindingContext = new HomeViewModel(page.navigationContext);
}

exports.onNavigatingTo = onNavigatingTo;

function openModal(args) {
    const mainView = args.object;
    const option = {
        context: {
            username: "test_username",
            password: "test"
        },
        closeCallback: () => {

        },
        // closeCallback: (username, password) => {
        //     // Receive data from the modal view. e.g. username & password
        //     alert(`Username: ${username} : Password: ${password}`);
        // },
        fullscreen: false
    };
    mainView.showModal(modalViewModule, option);
}

exports.openModal = openModal;