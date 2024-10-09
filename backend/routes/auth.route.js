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
  googleAuthSignup,
  googleAuthCallback,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { googleAuthClient } from "../google-auth/google-auth.config.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API test success",
  });
});

//Regular auth routes
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
router.get("/google", googleAuthSignup);

// Step 2: Google callback route after user authenticates
router.get("/google/callback", googleAuthCallback);

export default router;
