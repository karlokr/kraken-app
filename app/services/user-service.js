const httpModule = require("https");

function handleErrors(error) {
    console.error(error.message);
}

exports.register = function (user) {
    var promise = httpModule.request({
        url: "https://localhost/register.php",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password
        })
    });
    return promise;
};

exports.login = function (user) {
    var promise = httpModule.request({
        url: "https://localhost/signin.php",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            email: user.email,
            password: user.password
        })
    });
    return promise;
};

exports.resetPassword = function (email) {
    var promise = httpModule.request({
        url: "https://localhost/resetpw.php",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            email: email
        })
    });
    return promise;
}
