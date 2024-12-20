import RefreshToken from "../models/refreshTokenSchema.js";
import Users from "../models/UserSchema.js";
import { genCookies } from "../utils/generateCookies.js";
import {
  loginValidationSchema,
  passwordSchema,
  userValidationSchema,
} from "../validationSchema/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import dotenv from "dotenv";

dotenv.config();

export class AuthController {
  static async SignUp(req, res) {
    try {
      const { firstName, lastName, email, password, Designation } = req.body;

      if (!firstName || !lastName || !email || !password || !Designation) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const { error } = userValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = new Users({
        firstName,
        lastName,
        email,
        password: hashPassword,
        Designation,
        isVerified: false,
      });

      await user.save();
      // Send verification email
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const link = `${process.env.FRONTEND_URL}/verifyUser?token=${token}`;

      const htmlContent = `
  <p>Hello ${firstName},</p>
  <p>Please click the link below to verify your email address:</p>
  <a href="${link}">Verify Email</a>
`;
      console.log(link);

      const result = await sendMail({
        sender: process.env.SENDER_EMAIL,
        receiver: email,
        subject: "Verify Your Email Address",
        htmlContent,
      });

      if (!result.success) {
        return res
          .status(500)
          .json({ message: "Failed to send verification email" });
      }

      res.status(200).json({
        message: "Registration successful. Please verify your email.",
      });
    } catch (err) {
      console.error("SignUp Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async verifyUser(req, res) {
    try {
      const { token } = req.query;

      // Validate input
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(400).json({ message: "Invalid token" });
        }
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        throw err; // Rethrow for unexpected errors
      }

      // Check if the user exists
      const user = await Users.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }

      // Verify the user
      if (user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
      }

      user.isVerified = true;

      // Save updated user
      await user.save();

      res.status(200).json({ message: "User verified successfully" });
    } catch (err) {
      console.error("verifyUser Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async SignIn(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const { error } = loginValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }

      if (!user.isVerified) {
        return res
          .status(404)
          .json({ message: "Please verify your email before logging in" });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { accessToken, refreshToken } = await genCookies(user);

      const dbRefreshTokenRecord = await RefreshToken.findOne({
        userId: user._id,
      });

      if (dbRefreshTokenRecord) {
        dbRefreshTokenRecord.token = refreshToken;
        await dbRefreshTokenRecord.save();
      } else {
        const newRefreshToken = new RefreshToken({
          token: refreshToken,
          userId: user._id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //one month
        });
        await newRefreshToken.save();
      }

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };

      res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .status(200)
        .json({ message: "User logged in successfully" });
    } catch (err) {
      console.error("SignIn Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async SignOut(req, res) {
    try {
      res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .status(200)
        .json({ message: "User logged out successfully" });
    } catch (err) {
      console.error("SignOut Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async ForgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Validate email format
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if the user exists
      const user = await Users.findOne({ email });
      if (!user) {
        // Return a generic response to prevent exposing user existence
        return res.status(200).json({
          message: "If the email exists, a reset password link will be sent",
        });
      }

      // Generate a reset token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Construct the reset password link
      const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${token}`;

      // Email content
      const htmlContent = `
        <div>
          <h1>Reset Your Password</h1>
          <p>Hello ${user.firstName},</p>
          <p>Click the link below to reset your password. This link will expire in 1 hour:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <p>Thank you,</p>
          <p>The MegaNews Team</p>
        </div>
      `;

      // Send email
      const emailResult = await sendMail({
        sender: process.env.SENDER_EMAIL,
        receiver: user.email,
        htmlContent,
        subject: "Reset Password Request",
      });

      // Check email sending status
      if (!emailResult.success) {
        console.error(
          "Mail Error:",
          emailResult.message,
          emailResult.error || ""
        );
        return res.status(500).json({ message: "Failed to send reset email" });
      }

      // Success response
      res.status(200).json({
        message: "If the email exists, a reset password link will be sent",
      });
    } catch (err) {
      console.error("ForgotPassword Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async ResetPassword(req, res) {
    try {
      const { password } = req.body;
      const { token } = req.query;

      // Validate input
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      // Validate password using Joi schema
      const { error } = passwordSchema.validate({ password });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(400).json({ message: "Invalid token" });
        }
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        throw err; // Rethrow for unexpected errors
      }

      // Check if the user exists
      const user = await Users.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save updated user
      await user.save();

      res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      console.error("ResetPassword Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async RefreshAccessToken(req, res) {
    try {
      // Retrieve the incoming refresh token
      const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

      if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Refresh Token Required" });
      }

      // Verify the incoming refresh token
      let decodedToken;
      try {
        decodedToken = jwt.verify(
          incomingRefreshToken,
          process.env.JWT_REFRESH_TOKEN_SECRET
        );
      } catch (err) {
        return res
          .status(401)
          .json({ message: "Invalid or Expired Refresh Token" });
      }

      const { id } = decodedToken;

      // Check if the user exists in the database
      const isUserExist = await Users.findOne({ _id: id });
      if (!isUserExist) {
        return res
          .status(401)
          .json({ message: "Unauthorized Access: User Not Found" });
      }
      // Fetch the stored refresh token from the database
      const dbRefreshTokenRecord = await RefreshToken.findOne({ userId: id });
      if (!dbRefreshTokenRecord) {
        return res
          .status(401)
          .json({ message: "Unauthorized Access: Refresh Token Not Found" });
      }

      // Validate the incoming refresh token against the stored one
      if (incomingRefreshToken !== dbRefreshTokenRecord.token) {
        return res
          .status(401)
          .json({ message: "Refresh Token Mismatch or Expired" });
      }

      // Generate new tokens
      const { accessToken, refreshToken } = await genCookies(isUserExist);

      // Update the stored refresh token in the database
      dbRefreshTokenRecord.token = refreshToken;
      await dbRefreshTokenRecord.save();

      // Set new tokens as cookies and send response
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };

      res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .status(200)
        .json({ message: "Tokens refreshed successfully" });
    } catch (error) {
      console.error("Error refreshing access token:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
