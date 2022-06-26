module.exports = (app) => {
    const FileController = require('../controllers/files.controller');
    app.post('/add-file', FileController.uploadFile);
    // app.delete('/remove-file', FileController.deletefile);

}