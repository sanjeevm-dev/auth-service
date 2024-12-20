import { Router } from "express";
import asyncFunction from "express-async-handler";
import { UserController } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleBasedAccess from "../middlewares/roleBasedAccess.js";

const userApis = Router();

userApis.get(
  "/getUserById",
  authMiddleware,
  roleBasedAccess,
  asyncFunction(UserController.getUserById)
);
// userApis.get("getProfile", asyncFunction(UserController.getProfile));
userApis.get(
  "/getAllUsers",
  authMiddleware,
  roleBasedAccess("admin"),
  asyncFunction(UserController.getAllUsers)
);
userApis.post("/updateUser", asyncFunction(UserController.updateUser));
userApis.post("/deleteUser", asyncFunction(UserController.deleteUser));

export default userApis;
