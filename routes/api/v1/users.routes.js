const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/users.controllers");

router.post("/create", userController.createUser);
router.get("/fetchById/:id", userController.fetchUserById);
router.delete("/deleteUserById/:id", userController.deleteUserById);
router.put("/update/:id", userController.updateUser);
router.post("/login", userController.login);
module.exports = router;
