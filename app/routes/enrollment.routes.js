const authJwt = require("../middleware/auth.middleware");

module.exports = (app) => {
  const EnrollmentController = require("../controllers/enrollment.controller");
  app.post(
    "/enroll-student",
    authJwt.verifyTutor,
    EnrollmentController.enrollStudent
  );
  app.delete(
    "/unenroll-student",
    authJwt.verifyTutor,
    EnrollmentController.unenrollStudent
  );
};
