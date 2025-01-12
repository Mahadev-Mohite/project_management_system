const express = require("express");
const router = express.Router();
const authenticate = require("../../../middalwares/auth.middalware");
const taskController = require("../../../controllers/task.controller");

router.post("/create", authenticate, taskController.create);
router.get(
  "/getByProject/:project_id",
  authenticate,
  taskController.getByProject
);
router.delete("/delete/:id", authenticate, taskController.deletetaskById);
router.put("/update/:id", authenticate, taskController.updateTask);
router.put("/changestatus/:id", authenticate, taskController.updateTaskStatus);

module.exports = router;
