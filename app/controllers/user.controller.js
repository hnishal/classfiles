const UserModel = require("../models/user.model");
const RoleModel = require("../models/roles.model");
const bcrypt = require("bcrypt");
const authJwt = require("../middleware/auth.middleware");
const ClassModel = require("../models/class.model");
const enrollmentModel = require("../models/enrollment.model");

exports.newUser = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Body cannot be empty!" });
  }

  const { username, password, userRole } = req.body;
  try {
    var user = await UserModel.findOne({ username: username.toLowerCase() });
    if (user) {
      res.status(400).send({ message: "User already exists!" });
      return;
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }

  try {
    var role = await RoleModel.findOne({ name: userRole.toLowerCase() });
    if (!role) {
      res.status(404).send({
        message: "Invalid role!",
      });
      return;
    }
    const salt = await bcrypt.genSalt();
    console.log("salt", password);
    const hashP = await bcrypt.hash(password, salt);
    console.log("hashP", hashP);
    const user = new UserModel({
      username: username.toLowerCase(),
      password: hashP,
      userRole: userRole.toLowerCase(),
    });
    const user_Created = user
      .save()
      .then((data) => {
        console.log("fine 2");
        const token = authJwt.createJwt({
          username: username.toLowerCase(),
          password: hashP,
          userRole: userRole.toLowerCase(),
        });

        // req.session.token = token;
        console.log("fine 3");

        res.status(201).send({ user: user, token: token });
        console.log("fine 4");
      })
      .catch((err) => {
        console.log(err.message);

        res.status(404).send({
          message: err.message || "Something went wrong",
        });
      });
  } catch (err) {
    console.log("Error here 2");

    console.log(err);
    res.status(400).json({ err });
  }
};

exports.loginUser = async (req, res) => {
  if (!req.body) {
    console.log("empty body!");
    return res.status(404).send({ message: "Request body cannot be empty!" });
  }

  const { username, password } = req.body;
  let user_in_DB = await UserModel.findOne({
    username: username.toLowerCase(),
  });

  if (!user_in_DB) {
    res.status(400).send({ message: "Username not found!" });
    return;
  }

  try {
    const valid_p = await bcrypt.compare(password, user_in_DB.password);
    console.log("Passed here ");
    if (valid_p) {
      console.log("Passed here 2");
      const token = authJwt.createJwt({
        username: username.toLowerCase(),
        password: user_in_DB.password,
        userRole: user_in_DB.userRole,
      });
      console.log("Passed here 3");

      // res.cookie(`Username`, user_in_DB.username);

      res.status(201).json({
        message: "logged in!",
        user_in_DB,
        token,
      });
    } else {
      res.status(404).json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

exports.getClasses = async (req, res) => {
  if (!req.body) {
    console.log("empty body!");
    return res.status(404).send({ message: "Request body cannot be empty!" });
  }
  console.log("x-access-token: " + req.headers["x-access-token"]);
  var decoded = await authJwt.getDecodedJwt(req.headers["x-access-token"]);
  console.log("decoded", decoded);
  if (!decoded) {
    console.log("here 1");
    res.status(400).send({ message: "Something went wrong!" });
    return;
  }

  var role = await RoleModel.findOne({ name: decoded.userRole });

  if (!role) {
    console.log("here 2");

    res.status(400).send({ message: "Something went wrong!" });
    return;
  }
  var user = await UserModel.findOne({ username: decoded.username });
  if (!user) {
    console.log("here 3");

    res.status(400).send({ message: "Something went wrong!" });
    return;
  }
  var classes;
  if (role.writePermissions) {
    classes = await ClassModel.find({ tutor: user._id });
  } else {
    classes = await enrollmentModel.find({ userid: user._id });
  }
  if (classes) res.status(201).json({ classes: classes });
  else res.status(201).send({ message: "No classes found!" });
};
