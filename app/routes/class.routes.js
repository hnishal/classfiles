module.exports = (app) => {
    const ClassController = require('../controllers/class.controller');
    app.post('/create-class', ClassController.newclass);
    app.delete('/remove-class', ClassController.removeclass);
}