const mongoose = require("mongoose");
const projectScheme = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  progress: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["in progress", "completed"],
    default: "in progress",
  },
  createdAt: { type: Date, default: Date.now },
  assignedTo: [{ type: mongoose.Schema.ObjectId, ref: "Employee" }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: "Employee" },
});
module.exports = mongoose.model("Project", projectScheme);
