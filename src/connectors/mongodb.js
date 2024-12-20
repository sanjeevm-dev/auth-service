import mongoose from "mongoose";

export const dbConnect = async (MONGO_URI, DB_NAME) => {
  try {
    //connect to mongodb
    await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
