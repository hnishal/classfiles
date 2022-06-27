const EnrollmentModel = require("../models/enrollment.model");
const UserModel = require("../models/user.model");
const ClassModel = require("../models/class.model");
const { verifyTutor } = require("../middleware/auth.middleware");
exports.enrollStudent = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Body cannot be empty!" });
  }
  const { username, student, subject } = req.body;

  var user_tutor = await UserModel.findOne({
    username: username.toLowerCase(),
  });
  if (!user_tutor) {
    res.status(404).send({ message: "Tutor not found!" });
    return;
  }

  var user_student = await UserModel.findOne({
    username: student.toLowerCase(),
  });
  if (!user_student) {
    res.status(404).send({ message: "Student not found!" });
    return;
  }

  var curr_class = await ClassModel.findOne({
    tutor: user_tutor._id,
    subject: subject,
  });

  if (!curr_class) {
    res.status(404).send({ message: "Class not found!" });
    return;
  }

  const enrollment_exists = await EnrollmentModel.findOne({
    userid: user_student._id,
    classid: curr_class._id,
  });
  if (enrollment_exists) {
    res.status(400).send({ message: "Enrollment already exists!" });
    return;
  }

  const enrollment = new EnrollmentModel({
    userid: user_student._id,
    classid: curr_class._id,
  });

  try {
    const enrollment_added = enrollment
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

exports.unenrollStudent = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Body cannot be empty!" });
  }

  const { username, student, subject } = req.body;

  var user_tutor = await UserModel.findOne({
    username: username.toLowerCase(),
  });
  if (!user_tutor) {
    res.status(404).send({ message: "Tutor not found!" });
    return;
  }

  var user_student = await UserModel.findOne({
    username: student.toLowerCase(),
  });
  if (!user_student) {
    res.status(404).send({ message: "Student not found!" });
    return;
  }

  var curr_class = await ClassModel.findOne({
    tutor: user_tutor._id,
    subject: subject,
  });

  if (!curr_class) {
    res.status(404).send({ message: "Class not found!" });
    return;
  }

  const enrollment_exists = await EnrollmentModel.findOne({
    userid: user_student._id,
    classid: curr_class._id,
  });
  if (!enrollment_exists) {
    res.status(400).send({ message: "Enrollment dosent exists!" });
    return;
  }

  try {
    EnrollmentModel.deleteOne({ tutor: user_tutor._id, subject: subject })
      .then(() => {
        res.status(201).send({ message: "Enrollment successfully deleted!" });
      })
      .catch((error) => {
        res.status(400).send({ error });
      });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong!" });
  }
};
