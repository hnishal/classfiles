let mongoose = require("mongoose");

let classes = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "Users",
    },
    description: { type: String },
    subject: { type: String, required: true, index: true },
    files: [{ type: mongoose.Schema.Types.ObjectId, refs: "files" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classes", classes);
