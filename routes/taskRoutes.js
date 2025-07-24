const taskControllers = require("../controllers/taskControllers");
const express = require("express");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

const router = express.Router();

router.post("/create-task", jwtMiddleware, taskControllers.createTask);
router.get("/get-tasks", jwtMiddleware, taskControllers.getTasks);
router.put("/update-task/:id", jwtMiddleware, taskControllers.updateTask);
router.delete("/delete-task/:id", jwtMiddleware, taskControllers.deleteTask);
router.get("/get-tasks/:id", jwtMiddleware, taskControllers.getTasks);

module.exports = router;
