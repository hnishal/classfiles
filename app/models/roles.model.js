let mongoose = require('mongoose')

let roles = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    writePermissions: {
        type: Boolean, required: true, index: true

    }
})

module.exports = mongoose.model('Roles', roles)