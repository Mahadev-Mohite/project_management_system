const express = require("express");
const router = express.Router();
const authenticate = require("../../../middalwares/auth.middalware");
const projectController = require("../../../controllers/project.controllers");

router.post("/create", authenticate, projectController.create);
router.get("/getall", authenticate, projectController.getAllProject);
router.get("/getbyid/:id", authenticate, projectController.getByID);
router.post("/allocatemember", authenticate, projectController.AllocateMember);
router.delete("/delete/:id", authenticate, projectController.deleteProject);
router.put("/update/:id", authenticate, projectController.updateProject);
module.exports = router;
