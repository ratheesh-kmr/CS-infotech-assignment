const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Super Admin" },
  contact: { type: String, required: true },
  joinedDate: { type: Date, default: Date.now },
  profilePicture: { type: String, default: "" }, // URL to profile picture
});

module.exports = mongoose.model("Admin", AdminSchema);
