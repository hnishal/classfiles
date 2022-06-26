module.exports = (app) => {
    const FileController = require('../controllers/files.controller');
    app.post('/add-file', FileController.addfile);
    app.delete('/remove-file', FileController.deletefile);

}