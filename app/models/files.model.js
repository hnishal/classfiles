let mongoose = require("mongoose");

let files = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "users",
    }, // uploaded by which tutor
    uploadedAt: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "classes",
    }, // uploaded in which class
    description: { type: String },
    fileType: { type: String },

    file_key: { type: String, trim: true }, // The file key after S3 file upload is done
    file_mimetype: { type: String, trim: true }, // The mimetype helps download the correct filetype later
    file_location: { type: String, required: true, trim: true }, // The URL to download the file, provided after AWS S3 file upload is done
    file_name: { type: String, required: true, trim: true }, // The original name of the file that has been uploaded, without the date-time prefix
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Files", files);
