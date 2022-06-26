let mongoose = require('mongoose')

let enrollments = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Users' },
    classid: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Classes' },
},
    { timestamps: true })

module.exports = mongoose.model('Files', enrollments)