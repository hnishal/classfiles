const authJwt = require("../middleware/auth.middleware");

module.exports = (app) => {
  const ClassController = require("../controllers/class.controller");
  app.post("/create-class", authJwt.verifyTutor, ClassController.newclass);
  app.delete("/remove-class", authJwt.verifyTutor, ClassController.removeclass);
};
