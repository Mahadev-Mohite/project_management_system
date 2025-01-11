const express = require("express");
const router = express.Router();
const userRoute = require("./users.routes");
const projectRoute = require("./project.routes");

router.use("/user", userRoute);
router.use("/project", projectRoute);

module.exports = router;
