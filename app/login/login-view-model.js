const observableModule = require("tns-core-modules/data/observable");
const dialogsModule = require("tns-core-modules/ui/dialogs");
const userService = require("~/services/user-service");
const topmost = require("tns-core-modules/ui/frame").topmost;
var appSettings = require("tns-core-modules/application-settings");

function LoginViewModel() {
    const viewModel = observableModule.fromObject({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        isLoggingIn: true,
        toggleForm() {
            this.isLoggingIn = !this.isLoggingIn;
        },
        submit() {
            if (this.email.trim() === "" || this.password.trim() === "") {
                alert("Please provide both an email address and password.");
                return;
            }

            if (this.isLoggingIn) {
                this.login();
            } else {
                this.register();
            }
        },
        login() {
            userService.login({
                    email: this.email,
                    password: this.password
                }).then((data) => {
                    res = data["_bodyText"].split("\t");
                    code = res[0];
                    switch (code) {
                        case "0":
                            appSettings.setString("email", this.email);
                            appSettings.setString("id", res[1]);
                            appSettings.setString("firstName", res[2]);
                            appSettings.setString("lastName", res[3]);
                            topmost().navigate({
                                moduleName: "home/home-page",
                                clearHistory: true
                            });
                            break;
                        case "1":
                            alert("Server is down for maintainence. Please try again later.");
                            break;
                        case "2":
                            alert("Username does not exist. Please sign up for an account.");
                            break;
                        case "3":
                            alert("Username does not exist. Please sign up for an account.");
                            break;
                        case "6":
                            alert("The password you've entered is incorrect.");
                            break;
                    }
                })
                .catch((e) => {
                    console.error(e);
                    alert("Server is down for maintainence. Please try again later.");
                });
        },
        register() {
            if (this.password != this.confirmPassword) {
                alert("Your passwords do not match.");
                return;
            }
            userService.register({
                    email: this.email,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    password: this.password
                }).then((data) => {
                    res = data["_bodyText"].split("\t");
                    code = res[0];
                    switch (code) {
                        case "0":
                            alert("Your account was successfully created. You can now login.");
                            this.isLoggingIn = true;
                            break;
                        case "1":
                            alert("Server is down for maintainence. Please try again later.");
                            break;
                        case "2":
                            alert("Server is down for maintainence. Please try again later.");
                            break;
                        case "3":
                            alert("Email already exists in system. Did you forget your password?");
                            break;
                        case "4":
                            alert("Server is down for maintainence. Please try again later.");
                            break;
                        case "5":
                            alert("Server is down for maintainence. Please try again later.");
                            break;
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert("Server is down for maintainence. Please try again later.");
                });
        },
        forgotPassword() {
            dialogsModule.prompt({
                title: "Forgot Password",
                message: "Enter the email address you used to register for Kraken App to reset your password.",
                inputType: "email",
                defaultText: "",
                okButtonText: "Ok",
                cancelButtonText: "Cancel"
            }).then((data) => {
                if (data.result) {
                    userService.resetPassword(data.text.trim())
                        .then(() => {
                            alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                        }).catch(() => {
                            alert("Unfortunately, an error occurred resetting your password.");
                        });
                }
            });
        }
    });

    return viewModel;
}

module.exports = LoginViewModel;