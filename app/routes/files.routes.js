const authJwt = require("../middleware/auth.middleware");
const upload = require("../middleware/awshelpers");
module.exports = (app) => {
  const FileController = require("../controllers/files.controller");
  app.post(
    "/add-file",

    upload.single("file"),
    FileController.uploadFile
  );
  //   app.post("/remove-file", authJwt.verifyTutor, FileController.deletefile);
};
