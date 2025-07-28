// controllers/authController.js
const User = require("./../models/user");
const bcrypt = require("bcrypt");
const MyNotification = require("./../models/notification");
async function handleSignup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const newUser = new User({
      name,
      email,
      password,
    });
    await MyNotification.create({
      user: newUser._id,
      message: ` Welcome ${name} , your Account has been successfully created ... `,
      from: "686160b656334582e44785b8",
    });

    await newUser.save();

    return res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

module.exports = { handleSignup };
