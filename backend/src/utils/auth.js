import jwt from "jsonwebtoken";

export const validateCredentials = (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const emailRegexCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegexCheck.test(email)) {
    throw new Error("Invalid email format");
  }
};

export const generateToken = (user) => {
  try {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
      throw new Error("JWT_SECRET and JWT_EXPIRES_IN need to be configured");
    }

    return jwt.sign(
      { uid: user.uid, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const validateSignUp = (email, pswd, confirmPswd) => {
  if (!email || !pswd || !confirmPswd) {
    throw new Error("Please input all the required fields");
  }
  const emailRegexCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegexCheck.test(email)) {
    throw new Error("Invalid email format");
  }
};
