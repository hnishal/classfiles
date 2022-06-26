const classModel = require('../models/class.model');
const authJwt = require('../middleware/auth.middleware')


exports.newclass = async (req, res) => {
    authJwt.verifyToken(req)
}