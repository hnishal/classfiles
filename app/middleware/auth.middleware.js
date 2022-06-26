const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

var verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.id;
    next();
  });
};

var verifyTutor = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    if (decoded && decodeURI.userRole != "tutor") {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    next();
  });

}

const maxAge = 3 * 24 * 60 * 60;

var createJwt = (obj) => {
  return jwt.sign(obj, config.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
}

const authJwt = {
  verifyToken: verifyToken,
  verifyTutor: verifyTutor,
  createJwt: createJwt
};
module.exports = authJwt;
