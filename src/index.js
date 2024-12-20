import app from "./app.js";
import { dbConnect } from "./connectors/mongodb.js";
import dotenv from "dotenv";
dotenv.config();

async function bootStrap() {
  const SERVICE_PORT = process.env.SERVICE_PORT || 9000;
  const MONGO_URI = process.env.MONGO_URI;
  const DB_NAME = process.env.DB_NAME;

  try {
    await dbConnect(MONGO_URI, DB_NAME);

    app.listen(SERVICE_PORT, () => {
      console.log(`Server is running on port ${SERVICE_PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

bootStrap();
