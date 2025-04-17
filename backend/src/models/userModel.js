import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String, // Added type
      default: () => uuid().slice(0, 7),
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["consumer", "admin"],
      default: "consumer",
    },
    phone: {
      type: String,
    },
    otp: {
      value: { type: String },
      expiresAt: { type: Date },
      verified: { type: Boolean, default: false },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    favorites: [
      {
        type: String,
      },
    ],
    address: {
    state: String,
    country: String,
  }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isNew) return next(); // Prevent rehashing unnecessarily
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Verify password
userSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = async function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

  this.otp = {
    value: crypto.createHash("sha256").update(otp).digest("hex"), // Hash the OTP for security
    expiresAt,
    verified: false,
  };

  await this.save();
  return otp; // Return plain OTP to send to the user
};

// Verify OTP
userSchema.methods.verifyOTP = async function (enteredOtp) {
  if (
    !this.otp ||
    !this.otp.expiresAt ||
    this.otp.expiresAt.getTime() < Date.now()
  ) {
    throw new Error("OTP expired or invalid");
  }

  const isMatch =
    this.otp.value ===
    crypto.createHash("sha256").update(enteredOtp).digest("hex");

  if (!isMatch) throw new Error("Invalid OTP");

  this.otp.verified = true;
  this.otp.value = undefined; // Clear the OTP value after verification
  this.otp.expiresAt = undefined;

  await this.save();
  return true;
};

const User = mongoose.model("User", userSchema);

export default User;
