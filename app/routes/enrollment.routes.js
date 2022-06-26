const authJwt = require("../middleware/auth.middleware");

module.exports = (app) => {
  const EnrollmentController = require("../controllers/enrollment.controller");
  app.post("/add-user", authJwt.verifyTutor, ClassController.adduser);
  app.delete("/remove-user", authJwt.verifyTutor, ClassController.removeuser);
};
