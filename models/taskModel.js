const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  tag: { type: String },
  color: { type: String },
  sortOrder: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const tasks = mongoose.model("tasks", taskSchema)
module.exports = tasks;