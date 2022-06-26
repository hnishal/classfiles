module.exports = (app) => {
    const EnrollmentController = require('../controllers/enrollment.controller');
    app.post('/add-user', ClassController.adduser);
    app.delete('/remove-user', ClassController.removeuser);
}