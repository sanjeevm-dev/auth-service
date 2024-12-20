import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apis } from "./routes/index.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth-service", apis);

process.on("uncaughtException", (err) => {
  console.log("uncaughtException");
  console.log(err);
});

export default app;
