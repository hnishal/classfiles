// const router = require("express").Router(); // to handle express routes
const FileModel = require("../models/files.model");
// // Root Route to get all the files in the reverse chronological order of file upload time
// router.get("/", (req, res) => {
//     try {
//         File.find()
//             .then(
//                 (files) =>
//                     res.json(files.sort((a, b) => b.createdAt - a.createdAt)) // sort in reverse chronological order
//             )
//             .catch((err) => res.status(400).json(`Error: ${err}`));
//     } catch (error) {
//         if (error) res.status(500).json(error.message);
//     }
// });

// Route to upload new file
// router.post(
//     "/",

//     // use the multer configured 'upload' object as middleware, setup a single file upload
//     upload.single("file"),

//     // After the multer module takes care of uploading the file to the S3 bucket, create the corresponding DB document with required fields
//     (req, res) => {
//         const { key, mimetype, location } = req.file;
//         const lastUnderScore = key.lastIndexOf("__");
//         const file_name = key.slice(lastUnderScore + 2);
//         const file = new FileModel({
//             file_key: key,
//             file_mimetype: mimetype,
//             file_location: location,
//             file_name,
//         });

//         // Upon succefully saving the file object in the DB, return the created object
//         file.save()
//             .then(() => {
//                 File.findOne({ file_key: key })
//                     .then((file) => {
//                         res.json(file);
//                     })
//                     .catch((err) => res.status(400).send(`Error: ${err}`));
//             })
//             .catch((err) => res.status(400).json(`Error: ${err}`));
//     },
//     (error, req, res, next) => {
//         if (error) {
//             res.status(500).send(error.message);
//         }
//     }
// );

exports.uploadFile = async (req, res) => {
  const { key, mimetype, location } = req.file;
  const lastUnderScore = key.lastIndexOf("__");
  const file_name = key.slice(lastUnderScore + 2);
  const file = new FileModel({
    file_key: key,
    file_mimetype: mimetype,
    file_location: location,
    file_name,
  });

  // Upon succefully saving the file object in the DB, return the created object
  try {
    const file_Created = file
      .save()
      .then(() => {
        FileModel.findOne({ file_key: key })
          .then((file) => {
            res.json(file);
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
