import { Router } from "express";
import { testApis } from "./testRoutes.js";
import userApis from "./userRoutes.js";
import authApis from "./authRoutes.js";

export const apis = Router();

apis.use("/user", userApis);
apis.use("/auth", authApis);
apis.use("/test", testApis);

export default apis;
