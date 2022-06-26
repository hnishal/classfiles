module.exports = (app) => {
    const RolesController = require('../controllers/roles.controller');
    app.post('/add-role', RolesController.newRole);
}