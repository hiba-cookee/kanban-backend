const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("postgres", "postgres", "12345", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;

// const mongoose = require("mongoose");

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("MongoDB connected successfully");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });
