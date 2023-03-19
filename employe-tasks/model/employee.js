const mongoose = require("mongoose");
const employeeScheme = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["worker", "manager"], required: true },
  projects: [{ type: mongoose.Schema.ObjectId, ref: "Project" }],
});
module.exports = mongoose.model("Employee", employeeScheme);
