// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

    // GET route for getting all of the posts
    //   app.get("/api/posts/", function(req, res) {
    //     db.Post.findAll({})
    //       .then(function(dbPost) {
    //         res.json(dbPost);
    //       });
    //   });

    //   // Get route for returning posts of a specific category
    //   app.get("/api/posts/category/:category", function(req, res) {
    //     db.Post.findAll({
    //       where: {
    //         category: req.params.category
    //       }
    //     })
    //       .then(function(dbPost) {
    //         res.json(dbPost);
    //       });
    //   });

    //   // Get route for retrieving a single post
    //   app.get("/api/posts/:id", function(req, res) {
    //     db.Post.findOne({
    //       where: {
    //         id: req.params.id
    //       }
    //     })
    //       .then(function(dbPost) {
    //         res.json(dbPost);
    //       });
    //   });

    //   // POST route for saving a new post
    //   app.post("/api/posts", function(req, res) {
    //     console.log(req.body);
    //     db.Post.create({
    //       title: req.body.title,
    //       body: req.body.body,
    //       category: req.body.category
    //     })
    //       .then(function(dbPost) {
    //         res.json(dbPost);
    //       });
    //   });

    //   // DELETE route for deleting posts
    //   app.delete("/api/posts/:id", function(req, res) {
    //     db.Post.destroy({
    //       where: {
    //         id: req.params.id
    //       }
    //     })
    //       .then(function(dbPost) {
    //         res.json(dbPost);
    //       });
    //   });

    //   // PUT route for updating posts
    //   app.put("/api/posts", function(req, res) {
    //     db.Post.update(req.body,
    //       {
    //         where: {
    //           id: req.body.id
    //         }
    //       })
    //       .then(function(dbPost) {
    //         res.json(dbPost);
    //       });
    //   });

    // db.Survey.create({
    //     a1: 1,
    //     a2: 1,
    //     a3: 1,
    //     a4: 1,
    //     a5: 1,
    //     a6: false
    // });
    // db.Survey.create({
    //     a1: 5,
    //     a2: 5,
    //     a3: 5,
    //     a4: 5,
    //     a5: 5,
    //     a6: false
    // });
    // db.Survey.create({
    //     a1: 10,
    //     a2: 10,
    //     a3: 10,
    //     a4: 10,
    //     a5: 10,
    //     a6: true
    // });
};


