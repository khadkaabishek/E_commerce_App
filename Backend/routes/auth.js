const express = require("express");
const router = express();
const { handleSignup } = require("./../controllers/signup.js");
const { handleLogin } = require("./../controllers/login.js");
const { googleLogin } = require("../controllers/googlelogin.js");
router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.get("/google", googleLogin);
module.exports = router;
