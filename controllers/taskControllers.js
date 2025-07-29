const mongoose = require("mongoose");
const tasks = require("../models/taskModel");

exports.getTasks = async (req, res) => {
  try {
    let task = null;
    if (req.params.id) {
      task = await tasks.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
    } else {
      task = await tasks.find().select("-updatedAt -createdAt");
    }
    res.status(200).json({ message: "Tasks retrieved successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const userTasks = await tasks.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          // $expr: {
          //   $eq:['$userId',{$toObjectId : userId}]
          // }
        },
      },
      {
        $project: {
          userId:0
        }
      }
    ]);
    res
      .status(200)
      .json({ message: "Tasks retrieved successfully", tasks: userTasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createOrUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tag, color } = req.body;
    const existingTask = await tasks.findOneAndUpdate(
      { _id: id ? id : new mongoose.Types.ObjectId() },
      {
        userId: req.userId,
        title,
        description,
        category,
        tag,
        color,
      },
      {
        upsert: true, //create new doc if it doesn't exist
        new: true,
      }
    );
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task created or updated successfully",
      task: existingTask,
    });
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
