const authJwt = require("../middleware/auth.middleware");

module.exports = (app) => {
  const UserController = require("../controllers/user.controller");
  app.post("/add-user", UserController.newUser);
  app.post("/login-user", UserController.loginUser);
  //   app.get("/get-classes", authJwt.verifyToken, UserController.getClasses);x
};
