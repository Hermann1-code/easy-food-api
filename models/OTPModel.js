const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
    },

    verifyCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OTPModel = mongoose.model("OTP", OTPSchema);

module.exports = OTPModel;
