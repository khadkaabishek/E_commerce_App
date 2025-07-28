const axios = require("axios");
const { oauuth2client } = require("../utils/googleConfig");
const googleUser = require("../models/googleAuth");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    // console.log("code", code);
    // Exchange code for tokens
    const { tokens } = await oauuth2client.getToken(code);
    // console.log("token", tokens);
    // console.log("here man heere    1 ", oauuth2client._clientId);
    // console.log("here man heere    1 ", oauuth2client._clientId);
    oauuth2client.setCredentials(tokens);

    // console.log("here man heere   2 ", oauuth2client._clientId);
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );
    // console.log("here man heere  3  ", userRes);

    const { id: googleId, email, name, picture } = userRes.data;
    const image = picture;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, image, googleId });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "success", token, user });
  } catch (error) {
    // console.error("Google Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { googleLogin };
