const taskControllers = require("../controllers/task");
// const taskControllers = require("../controllers/taskControllers");
const express = require("express");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

const router = express.Router();

// router.post("/create-task", jwtMiddleware, taskControllers.createOrUpdate);
// router.get("/get-tasks", jwtMiddleware, taskControllers.getTasks);
// router.put("/update-task/:id", jwtMiddleware, taskControllers.createOrUpdate);
// router.delete("/delete-task/:id", jwtMiddleware, taskControllers.deleteTask);
// router.get("/get-tasks/:id", jwtMiddleware, taskControllers.getTasks);
// router.get("/user-tasks", jwtMiddleware, taskControllers.getUserTasks);

router.get("/get-tasks", jwtMiddleware, taskControllers.getTask);
router.get("/get-tasks/:id", jwtMiddleware, taskControllers.getTask);
router.get("/all-tasks", jwtMiddleware, taskControllers.getAllTasks);
router.post("/create-task", jwtMiddleware, taskControllers.createTask);
router.delete('/delete-task/:id',jwtMiddleware,taskControllers.deleteTask)
router.put("/update-task/:id", jwtMiddleware, taskControllers.updateTask);
router.put("/update-sortOrder", jwtMiddleware, taskControllers.updateSortOrder);


module.exports = router;
