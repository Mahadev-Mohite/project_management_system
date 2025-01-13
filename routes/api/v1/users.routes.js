const express = require("express");
const router = express.Router();
const authenticate = require("../../../middalwares/auth.middalware");
const userController = require("../../../controllers/users.controller");

router.post("/create", userController.createUser);
router.get("/fetchById/:id", authenticate, userController.fetchUserById);
router.delete(
  "/deleteUserById/:id",
  authenticate,
  userController.deleteUserById
);
router.put("/update/:id", authenticate, userController.updateUser);
router.post("/login", userController.login);
router.get("/getall", authenticate, userController.getAllUsers);
module.exports = router;
