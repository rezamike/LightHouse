// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");
// Routes
// =============================================================

module.exports = function (app) {

    app.post('/neighborhood/:value', (req, res) => {
        console.log(req.params.value);
    });

    app.post('/businesses/:value', (req, res) => {
        console.log(req.params.value);
    });

    // GET route for getting all of the posts
    //   app.get("/api/posts/", function(req, res) {
    //     db.Post.findAll({})
    //       .then(function(dbPost) {
    //         res.json(dbPost);
    //       });
    //   });


};