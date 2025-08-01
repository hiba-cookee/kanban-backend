const users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res,next) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      throw new Error("Email Already Exists")
      // return res.status(409).json({ message: "User already exists" });
    }
    const newUser = new users({
      fullName,
      email,
      password,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    // res.status(500).json({ message: "Server error", error: error.message });
    next(error) //pass to error middleware
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    // res.status(500).json({ message: "Server error" });
    next(error)
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUser = await users.aggregate([
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "userId",
      as: "user_tasks"
    }
  },
  {
    $project: {
      user_tasks: {
        title: 1,
        description: 1,
        category: 1,
        tag: 1,
        color: 1,
      },
      fullName: {
        $concat: ["$firstName", " ", "$lastName"]
      },
    }
  },
]);
    res
      .status(200)
      .json({ message: "Users retrieved successfully", allUser: allUser });
  } catch (error) {
    next(error)
  }
};
