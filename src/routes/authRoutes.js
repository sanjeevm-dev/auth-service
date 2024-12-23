import { Router } from "express";
import asyncFunction from "express-async-handler";
import { AuthController } from "../controllers/authController.js";

const authApis = Router();

authApis.post("/signUp", asyncFunction(AuthController.SignUp));
authApis.post("/signIn", asyncFunction(AuthController.SignIn));
authApis.post(
  "/signInWithGoogle",
  asyncFunction(AuthController.signInWithGoogle)
);
authApis.post("/signOut", asyncFunction(AuthController.SignOut));
authApis.post(
  "/refreshAccessToken",
  asyncFunction(AuthController.RefreshAccessToken)
);
authApis.post("/forgotPassword", asyncFunction(AuthController.ForgotPassword));
authApis.post("/resetPassword", asyncFunction(AuthController.ResetPassword));
authApis.post("/verifyUser", asyncFunction(AuthController.verifyUser));

export default authApis;
