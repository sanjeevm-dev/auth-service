import Users from "../models/UserSchema.js";
import { userValidationSchema } from "../validationSchema/userSchema.js";

export class UserController {
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await Users.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await Users.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { firstName, lastName, email, Designation } = req.body;
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const user = await Users.findByIdAndUpdate(
        { _id: id },
        { firstName, lastName, email, Designation },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const user = await Users.findByIdAndDelete({ _id: id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
