const RolesModel = require('../models/roles.model')

exports.newRole = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: 'Body cannot be empty!' })
    }
    const { name, writePermissions } = req.body;
    try {
        var user = await RolesModel.findOne({ name: name.toLowerCase() })
        if (user) {
            res.status(400).send({ message: 'User already exists!' });
            return
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

    try {
        const role = new RolesModel({
            name: name.toLowerCase(),
            writePermissions: writePermissions
        });
        const role_created = role
            .save()
            .then((data) => {
                console.log(data);
                res.status(201).send({ name: name, writePermissions: writePermissions });
            }).catch((err) => {
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

}