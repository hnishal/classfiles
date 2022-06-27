const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const RoleModel = require("../models/roles.model");

var verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    const { username } = req.body;
    if (username == decoded.username) {
      next();
    } else {
      return res.status(401).send({
        message: "Data Mismatch!",
      });
    }
  });
};

var verifyTutor = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    if (decoded) {
      var role = await RoleModel.findOne({ name: decoded.userRole });
      if (!role) {
        res.status(404).send({ message: "Role does not exist" });
        return;
      }
      if (!role.writePermissions) {
        res.status(401).send({
          message: "Unauthorized!",
        });
        return;
      }
      const { username } = req.body;
      if (username.toLowerCase() == decoded.username) {
        next();
      } else {
        console.log(username + decoded.username);
        return res.status(401).send({
          message: "Data Mismatch!",
        });
      }
    } else {
      res.status(401).send({
        message: "Unauthorized!",
      });
      return;
    }
  });
};

const maxAge = 3 * 24 * 60 * 60;

var createJwt = (obj) => {
  return jwt.sign(obj, config.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

const authJwt = {
  verifyToken: verifyToken,
  verifyTutor: verifyTutor,
  createJwt: createJwt,
};
module.exports = authJwt;
