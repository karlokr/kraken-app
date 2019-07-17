const fetchModule = require("fetch");
var appSettings = require("application-settings");

function handleErrors(error) {
    console.error(error.message);
}

exports.getGraphStats = function (data) {
    return fetchModule.fetch(
            "https://joshkraken.com/sqlconnect/graphStats.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    stat: data.stat,
                    id: appSettings.getString("id")
                })
            }).then(function (res) {
            return res.json();
        })
        .then(function (data) {
            //console.log(data.origin); 
            return data;
        })
};