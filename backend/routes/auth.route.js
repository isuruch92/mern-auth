import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  resendVerifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  googleAuthCallback,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { googleAuthClient } from "../google-auth/google-auth.config.js";

const router = express.Router();

//Email/Password auth routes
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-verify-email", resendVerifyEmail);

router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//Google auth routes
// Step 1: Redirect user to Google's OAuth server for authentication
router.get("/google", (req, res) => {
  const authUrl = googleAuthClient.generateAuthUrl({
    access_type: "offline", // 'offline' to get a refresh token if needed
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ], // Permissions requested from the user
  });
  res.redirect(authUrl); // Redirect the user to Google's OAuth login page
});

// Step 2: Google callback route after user authenticates
router.get("/google/callback", googleAuthCallback);

export default router;
