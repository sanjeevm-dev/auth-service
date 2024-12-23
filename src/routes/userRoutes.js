import { Router } from "express";
import asyncFunction from "express-async-handler";
import { UserController } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleBasedAccess from "../middlewares/roleBasedAccess.js";

const userApis = Router();

userApis.get(
  "/getCurrentUser",
  authMiddleware,
  asyncFunction(UserController.getCurrentUser)
);

userApis.get(
  "/getUserById",
  authMiddleware,
  asyncFunction(UserController.getUserById)
);
// userApis.get("getProfile", asyncFunction(UserController.getProfile));
userApis.get(
  "/getAllUsers",
  authMiddleware,

  asyncFunction(UserController.getAllUsers)
);
userApis.post("/updateUser", asyncFunction(UserController.updateUser));
userApis.post("/deleteUser", asyncFunction(UserController.deleteUser));

export default userApis;
