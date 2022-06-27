// const router = require("express").Router(); // to handle express routes
const classModel = require("../models/class.model");
const FileModel = require("../models/files.model");
const userModel = require("../models/user.model");
require("dotenv").config();
const multer = require("multer"); // to handle file uploads in Node.js
const aws = require("aws-sdk"); // to connect to the S3 bucket, we use the aws-sdk
const multerS3 = require("multer-s3"); // to help deal with file upload to the S3 bucket
const fs = require("fs");

// Create a new instance of the S3 bucket object with the correct user credentials
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

// Setup the congifuration needed to use multer
// const upload = multer({
//   // Use the following block of code to store the files in local storage on file upload

//   // storage: multer.diskStorage({
//   //     destination(req, file, cb) {
//   //         cb(null, "./server-side/sent_files");
//   //     },
//   //     filename(req, file, cb) {
//   //         cb(null, `${new Date().getTime()}__${file.originalname}`);
//   //     },
//   // }),

//   // Set the storage as the S3 bucker using the correct configuration
//   storage: multerS3({
//     s3,
//     acl: "public-read", // public S3 object, that can be read
//     bucket: "classfilesstorage", // bucket name
//     key: function (req, file, cb) {
//       // callback to name the file object in the S3 bucket
//       // The filename is prefixed with the current time, to avoid multiple files of same name being uploaded to the bucket
//       console.log(file);
//       cb(null, `${new Date().getTime()}__${file.originalname}`);
//     },
//   }),
//   limits: {
//     fileSize: 5000000, // maximum file size of 5 MB per file
//   },

//   // Configure the list of file types that are valid
//   fileFilter(req, file, cb) {
//     if (
//       !file.originalname.match(
//         /\.(jpeg|jpg|png|webp|gif|pdf|doc|docx|xls|xlsx|svg|ppt|pptx)$/
//       )
//     ) {
//       return cb(
//         new Error(
//           "Unsupported file format, please choose a different file and retry."
//         )
//       );
//     }
//     cb(undefined, true);
//     // continue with file upload without errors
//   },
// }).single("file");

// async function uploadNewFile(req, res) {
//   try {
//     let uploadMediaFileAudio = await classFilePromise(req, res);
//     // let uploadArtFile =  await artFilePromise(req, res);
//     // let fileObj = {}

//     return req;
//   } catch {}
// }

// async function classFilePromise(req, res) {
//   return new Promise((resolve, reject) => {
//     upload(req, res, (err, data) => {
//       if (err) {
//         reject(false);
//       }
//       console.log(data);
//       resolve(req.file);
//     });
//   });
// }
async function fsModule(req, res) {
  return new Promise(function (resolve, reject) {
    var fileName = fs.readFileSync(req.files.file.path);

    var params = {
      Bucket: "classfilesstorage",
      Key: "My_file",
      Body: fileName,
    };

    s3.upload(params, function (err, data) {
      resolve(data);
    });
  });

  // console.log("heeeeeeeeeeeè", data);

  // res.writeHead(200, { "Content-Type": "application/json" });
  // var { fields, files } = req;
  // res.end(JSON.stringify({ fields, files }, null, 2));
}

exports.uploadFile = async (req, res) => {
  console.log("fine till here");
  var awsResponse = await fsModule(req, res);
  console.log("Aws response: " + awsResponse.Location);

  if (!req.body && !req.fields) {
    res.status(400).send({ message: "Body cannot be empty!" });
    return;
  }
  const { username, subject, description, file_name } = req.fields;
  // const lastUnderScore = key.lastIndexOf("__");
  // const file_name = key.slice(lastUnderScore + 2);
  var user = await userModel.findOne({ username: username });
  if (!user) {
    res.status(404).send({ message: "User not found!" });
    return;
  }
  var currClass = await classModel.findOne({
    tutor: user._id,
    subject: subject,
  });
  if (!currClass) {
    res.status(404).send({ message: "Class not found!" });
    return;
  }
  var location = awsResponse.Location;
  const file = new FileModel({
    file_location: location,
    file_name: file_name,
    uploadedBy: user._id,
    uploadedAt: currClass._id,
    description: description,
  });

  // Upon succefully saving the file object in the DB, return the created object
  try {
    const file_Created = file
      .save()
      .then(() => {
        FileModel.findOne({ file_name: file_name })
          .then((file) => {
            res.json(file);
            return;
          })
          .catch((err) => res.status(400).send(`Error: ${err}`));
      })
      .catch((err) => res.status(400).json(`Error: ${err}`));
  } catch (err) {
    console.log("Error here 2");

    console.log(err);
    res.status(400).json({ err });
  }
};

// Route to get a particular file object from the DB
// router.get("/:id", (req, res) => {
//     FileModel.findById(req.params.id)
//         .then((file) => {
//             // Set the response content type to be the file's mimetype to avoid issues with blob type response
//             res.set({
//                 "Content-Type": file.file_mimetype,
//             });

//             // The params are required to access objects from the S3 bucket
//             const params = {
//                 Key: file.file_key,
//                 Bucket: "easysharebucket",
//             };

//             // get the correct S3 object using the File object fetched from the DB
//             s3.getObject(params, (err, data) => {
//                 if (err) {
//                     res.status(400).json(`Error: ${err}`);
//                 } else {
//                     // return the file object from the DB, as well as the actual file data in the form of a buffer array from the S3 object
//                     res.json({ file, data });
//                 }
//             });
//         })
//         .catch((err) => res.status(400).json(`Error: ${err}`));
// });

// route to delete all the files from the DB, not from the S3 bucket
// router.delete("/", (req, res) => {
//     FileModel.deleteMany({}).then(() => res.json("All files deleted"));
// });

// return the router with all the configured routes
// module.exports = router;
