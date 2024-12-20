import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    Designation: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      require: true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("User", userSchema);

export default Users;
