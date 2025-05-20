const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 18) {
          throw new Error("Age must be greater than 18");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender is not valid");
        }
      },
    },
    aboutMe: {
      type: String,
      validate(value) {
        if (value.length > 250) {
          throw new Error("About me should not exceed 250 characters");
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skills should not exceed 10");
        }
      },
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const id = user._id;
  const token = await jwt.sign({ id }, "Bhumireddy@123", { expiresIn: "2h" });
  return token;
};

userSchema.methods.validateUser = async function (passwordBYUserInput) {
  const user = this;
  const isMatch = await bcrypt.compare(passwordBYUserInput, user.password);
  return isMatch;
};
module.exports = mongoose.model("User", userSchema);
