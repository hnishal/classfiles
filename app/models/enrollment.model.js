let mongoose = require("mongoose");

let enrollments = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "users",
    },
    classid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "classes",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollments", enrollments);
