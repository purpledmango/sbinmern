import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import {
  validateCredentials,
  generateToken,
  validateSignUp,
} from "../utils/auth.js";

// Signup Controller
export const signUpController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, address } = req.body;
    console.log(req.body);
    validateSignUp(email, password, confirmPassword);

    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(403)
        .json({ message: "User with this email is already registered" });
    }

    const newUser = new User({
      name,
      email,
      password,
      phone,
      address
    });

    const passwordVerified = newUser.verifyPassword(confirmPassword);

    if (!passwordVerified) {
      return res.status(201).json({
        message: "Your password does not match!",
      });
    }

    // Save the user to the database
    const registeredUser = await newUser.save();

    // Generate JWT token
    const token = generateToken(registeredUser);
    // Response
    return res.status(201).json({
      message: "User registered successfully!",
      token, // Include the token
      user: {
        uid: registeredUser.uid,
        name: registeredUser.name,
        email: registeredUser.email,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Input Validation
    validateCredentials(email, password);

    // 2️⃣ Check if User Exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `No user registered with email - ${email}` });
    }

    // 3️⃣ Check for Existing Token in Authorization Header
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1]; //

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.email === email) {
          return res.status(200).json({
            message: "User is already logged in",
            token,

            user: {
              uid: user.uid,
              role: user.role,
              email: user.email,
            },
          });
        }
      } catch (error) {
        // Invalid or expired token, proceed to re-authenticate
      }
    }

    // 4️⃣ Password Verification
    const isPasswordCorrect = user.verifyPassword;
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // genearate token
    const token = generateToken(user);

    // return the auth response
    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const logoutController = (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (e) {
    return res.status(500).json({ message: "Server Error", error: e });
  }
};
