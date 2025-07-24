const tasks = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const { title, description, category, tag, color } = req.body;
    if (!title || !category) {
      return res
        .status(400)
        .json({ message: "Title and category are required" });
    }
    const newTask = new tasks({ title, description, category, tag, color });
    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    let task = null;
    if (req.params.id) {
      task = await tasks.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
    } else {
      task = await tasks.find();
    }
    res.status(200).json({ message: "Tasks retrieved successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tag, color } = req.body;
    const existingTask = await tasks.findById(id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    const updatedTask = await tasks.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        title: title ? title : existingTask.title,
        description: description ? description : existingTask.description,
        category: category ? category : existingTask.category,
        tag: tag ? tag : existingTask.tag,
        color: color ? color : existingTask.color,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTAsk = await tasks.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Task deleted successfully", task: deletedTAsk });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
