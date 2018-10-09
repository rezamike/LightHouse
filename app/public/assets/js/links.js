var express = require("express");
var app = express();

app.get("/mainmapresults", function(req, res){
    res.sendFile(path.join(__dirname, "app/public/mainmapresults.html"));
});


