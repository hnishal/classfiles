const ClassModel = require("../models/class.model");
const UserModel = require("../models/user.model");
const FileModel = require("../models/files.model");
const EnrollmentModel = require("../models/enrollment.model");
const authJwt = require("../middleware/auth.middleware");
const classRoutes = require("../routes/class.routes");
// const { json } = require("sequelize/types");
// const filesModel = require("../models/files.model");

exports.newClass = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Body cannot be empty!" });
  }
  const { username, description, subject } = req.body;
  var user = await UserModel.findOne({ username: username.toLowerCase() });
  if (!user) {
    res.status(404).send({ message: "Tutor not found!" });
    return;
  }

  try {
    const classexists = await ClassModel.findOne({
      tutor: user._id,
      subject: subject,
    });
    if (classexists) {
      res.status(500).send({ message: "class already exists!" });
      return;
    }
  } catch (error) {
    console.log(error.message || "hello");
  }

  const classcreate = new ClassModel({
    tutor: user._id,
    description: description,
    subject: subject,
  });

  try {
    const class_created = classcreate
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => res.status(400).json(`Error: ${err}`));
  } catch (err) {
    console.log("Error here 2");

    console.log(err);
    res.status(400).json({ err });
  }
};

exports.removeClass = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Body cannot be empty!" });
  }
  const { username, subject } = req.body;

  var user = await UserModel.findOne({ username: username.toLowerCase() });
  if (!user) {
    res.status(404).send({ message: "Tutor not found!" });
    return;
  }

  var currClass = await ClassModel.findOne({
    tutor: user._id,
    subject: subject,
  });

  if (!currClass) {
    res.status(404).send({ message: "Class not found!" });
    return;
  }
  try {
    await FileModel.deleteMany({ uploadedAt: currClass._id });
  } catch (err) {
    res.status(500).send({ message: "Couldnt delete class files!" });
  }

  try {
    await EnrollmentModel.deleteMany({ classid: currClass._id });
  } catch (err) {
    res.status(500).send({ message: "Couldnt delete class files!" });
  }

  try {
    await ClassModel.deleteOne({ tutor: user._id, subject: subject });
    res.status(201).send({ message: "Class removed successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.updateClass = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Body cannot be empty!" });
  }
  const { username, subject, description } = req.body;

  var user = await UserModel.findOne({ username: username.toLowerCase() });
  if (!user) {
    res.status(404).send({ message: "Tutor not found!" });
    return;
  }

  var currClass = await ClassModel.findOne({
    tutor: user._id,
    subject: subject,
  });

  if (!currClass) {
    res.status(404).send({ message: "Class not found!" });
    return;
  }

  try {
    ClassModel.updateOne(
      {
        tutor: user._id,
        subject: subject,
      },
      {
        description: description,
      }
    ).then((data) => {
      res.status(201).send({ message: "succesfully update" });
    });
  } catch (error) {
    res.status(500).send({ message: "Could not update" });
    return;
  }
};
