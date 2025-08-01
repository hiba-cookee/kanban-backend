const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/DBConnect");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskroutes"));

app.use((err, req, res, next) => {
  console.log(err.message);
  res
    .status(err.statusCode || 400)
    .json({ message: err.message || "Something went wrong" });
});

sequelize.authenticate().then(() => {
  console.log("DB Connected")
}).catch(err => {
  console.log("DB Connection Failed",err.message)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get("/", (req, res) => {
  res.send("Sever is running");
});
