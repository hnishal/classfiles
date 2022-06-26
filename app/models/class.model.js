let mongoose = require('mongoose')

let classes = new mongoose.Schema({
    tutor: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Users' },
    description: { type: String },
    subject: { type: String, required: true },
},
    { timestamps: true })

module.exports = mongoose.model('Classes', classes)