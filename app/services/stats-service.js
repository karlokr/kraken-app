const fetchModule = require("tns-core-modules/fetch");
var appSettings = require("tns-core-modules/application-settings");
exports.getGraphStats = function (data) {
    return fetchModule.fetch(
            "https://ecocitythegame.ca/sqlconnect-kraken/graphStats.php", {
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
            return data;
        })
};

exports.getPhotos = function (data) {
    return fetchModule.fetch(
            "https://ecocitythegame.ca/sqlconnect-kraken/getPics.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: appSettings.getString("id"),
                    pageno: data.pageno
                })
            }).then(function (res) {
            return res.json();
        })
        .then(function (data) {
            return data;
        })
};

exports.deletePhoto = function (data) {
    return fetchModule.fetch(
            "https://ecocitythegame.ca/sqlconnect-kraken/deletePic.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: appSettings.getString("id"),
                    firstName: appSettings.getString("firstName").toLowerCase(),
                    lastName: appSettings.getString("lastName").toLowerCase(),
                    filename: data.filename,
                    note: data.note
                })
            }).then(function (res) {
            return res.json();
        })
        .then(function (data) {
            return data;
        })
};

exports.getListView = function (data) {
    return fetchModule.fetch(
            "https://ecocitythegame.ca/sqlconnect-kraken/getListView.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: appSettings.getString("id"),
                    stat: data.stat,
                    week: data.week
                })
            }).then(function (res) {
            return res.json();
        })
        .then(function (data) {
            return data;
        })
}

exports.insertStat = function (data) {
    return fetchModule.fetch(
            "https://ecocitythegame.ca/sqlconnect-kraken/insertStat.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    stat: data.stat,
                    id: appSettings.getString("id"),
                    measurement: data.measurement
                })
            })
        .then(function (data) {
            return data["_bodyText"];
        })
};