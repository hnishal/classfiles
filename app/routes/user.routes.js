module.exports = (app) => {
    const UserController = require('../controllers/user.controller');
    app.post("/add-user", UserController.newUser);
    app.post("/login-user", UserController.loginUser);
}