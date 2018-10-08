var path = require("path");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/mainpage.html"));
    });

    app.get("/:query", function (req, res) {
        switch (req.params.query) {
            case "mainmapresults":
                res.sendFile(path.join(__dirname, "../public/mainmapresults.html"));
                break;
            default: res.sendFile(path.join(__dirname, "../public/404.html"));
        };
    });

};