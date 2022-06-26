let mongoose = require('mongoose')

let files = new mongoose.Schema({
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Users' }, // uploaded by which tutor
    uploadedAt: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'Classes' }, // uploaded in which class
    description: { type: String },
    fileType: { type: String, required: true },
    filename: { type: String, required: true, index: true },

},
    { timestamps: true })

module.exports = mongoose.model('Files', files)