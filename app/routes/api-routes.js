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

  app.post("/api/surveys", function (req, res) {
    console.log(req.body);
    db.Survey.create({
      businessName: req.body.businessName,
      uniqueID: req.body.uniqueID,
      a1: req.body.a1,
      a2: req.body.a2,
      a3: req.body.a3,
      a4: req.body.a4,
      a5: req.body.a5,
      security: req.body.security,
      textBox: req.body.textBox,
      timeDay: req.body.timeDay
    })
      .then(function (dbSurvey) {
        res.json(dbSurvey);
      });
  });

  //   // PUT route for updating surveys?
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