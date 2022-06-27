const authJwt = require("../middleware/auth.middleware");

module.exports = (app) => {
  const ClassController = require("../controllers/class.controller");
  app.post("/create-class", authJwt.verifyTutor, ClassController.newClass);
  app.delete("/remove-class", authJwt.verifyTutor, ClassController.removeClass);
  app.put("/update-class", authJwt.verifyTutor, ClassController.updateClass);
};
