const express = require("express");
const router = express.Router();
const userRoute = require("./users.routes");
const projectRoute = require("./project.routes");
const taskRoute = require("./task.routes");

router.use("/user", userRoute);
router.use("/project", projectRoute);
router.use("/task", taskRoute);

module.exports = router;
