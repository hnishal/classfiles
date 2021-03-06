let mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    userRole: { type: String, required: true, ref: "Roles" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
