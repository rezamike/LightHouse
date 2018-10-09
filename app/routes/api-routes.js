// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");
// Routes
// =============================================================

module.exports = function (app) {

  // GET route for getting all of the survey information and mesh into a formula to calculate average score
  app.get("/api/surveys/", function (req, res) {
    db.Survey.findAll({})
      .then(function (dbSurvey) {
        res.json(dbSurvey);
      });
  });

  //   // Get route for returning specific neighborhood information
  app.get("/api/crimes/neighborhoods/:neighborhood", function (req, res) {
    db.Crime.findAll({
      where: {
        neighborhood: req.params.neighborhood
      }
    })
      .then(function (dbCrime) {

        //?
        res.json(dbCrime);
      });
  });

  //  !!!!!!!!!   FINSIH    // POST route for saving a new post
  app.post("/api/surveys", function (req, res) {
    console.log(req.body);
    db.Survey.create({
      neighborhood: req.body.neighborhood,
      body: req.body.body,
      category: req.body.category
    })
      .then(function (dbSurvey) {
        res.json(dbSurvey);
      });
  });

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

};