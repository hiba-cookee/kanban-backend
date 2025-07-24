const users = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Creating user with data:", { username, email, password });
    const existingUser = await users.findOne({ email })
    console.log(existingUser)
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new users({ username, email, password });   
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
