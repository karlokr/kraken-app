const httpModule = require("https");
const fetchModule = require("tns-core-modules/fetch");

function handleErrors(error) {
    console.error(error.message);
}

exports.register = function (user) {
    var promise = fetchModule.fetch(
        "https://ecocitythegame.ca/sqlconnect/register.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password
            })
        });
    return promise;
};

exports.login = function (user) {
    var promise = fetchModule.fetch(
        "https://ecocitythegame.ca/sqlconnect/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });
    return promise;
};

exports.resetPassword = function (email) {
    var promise = httpModule.request({
        url: "https://ecocitythegame.ca/sqlconnect/resetpw.php",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        content: JSON.stringify({
            email: email
        })
    });
    return promise;
}