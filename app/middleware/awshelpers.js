require("dotenv").config();
const multer = require("multer"); // to handle file uploads in Node.js
const aws = require("aws-sdk"); // to connect to the S3 bucket, we use the aws-sdk
const multerS3 = require("multer-s3"); // to help deal with file upload to the S3 bucket
let FileModel = require("../models/files.model"); // The file model to create new models

// Create a new instance of the S3 bucket object with the correct user credentials
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

// Setup the congifuration needed to use multer
const upload = multer({
  // Use the following block of code to store the files in local storage on file upload

  // storage: multer.diskStorage({
  //     destination(req, file, cb) {
  //         cb(null, "./server-side/sent_files");
  //     },
  //     filename(req, file, cb) {
  //         cb(null, `${new Date().getTime()}__${file.originalname}`);
  //     },
  // }),

  // Set the storage as the S3 bucker using the correct configuration
  storage: multerS3({
    s3,
    acl: "public-read", // public S3 object, that can be read
    bucket: "classfilesstorage", // bucket name
    key: function (req, file, cb) {
      // callback to name the file object in the S3 bucket
      // The filename is prefixed with the current time, to avoid multiple files of same name being uploaded to the bucket
      console.log(file);
      cb(null, `${new Date().getTime()}__${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 5000000, // maximum file size of 5 MB per file
  },

  // Configure the list of file types that are valid
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(
        /\.(jpeg|jpg|png|webp|gif|pdf|doc|docx|xls|xlsx|svg|ppt|pptx)$/
      )
    ) {
      return cb(
        new Error(
          "Unsupported file format, please choose a different file and retry."
        )
      );
    }
    cb(undefined, true);
    // continue with file upload without errors
  },
});

module.exports = upload;
