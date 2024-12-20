import { Router } from "express";

export const testApis = Router();

testApis.get("/", async (req, res) => {
  res.send({ message: "ok" });
});
