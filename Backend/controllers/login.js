const User = require("../models/user");
const jwt = require("jsonwebtoken");
const MyNotification = require("./../models/notification");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

async function handleLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  await MyNotification.create({
    user: user._id,
    message: ` New login detected `,
    from: "686160b656334582e44785b8",
  });

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = { handleLogin };
