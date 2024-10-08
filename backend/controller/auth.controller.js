import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import { PendingUser } from "../models/pending-user.model.js";
import { googleAuthClient } from "../google-auth/google-auth.config.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw Error("All fields are required!");
    }

    // Check if the user already exists in either User or PendingUser collections
    const userAlreadyExists = await User.findOne({ email });
    const pendingUserExists = await PendingUser.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (pendingUserExists) {
      return res.status(400).json({
        success: false,
        message:
          "A verification email has already been sent. Please verify your email.",
        code: "E001",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // const user = new User({
    //   email,
    //   password: hashedPassword,
    //   name,
    //   verificationToken,
    //   verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24
    // });
    // await user.save();

    //First create a user in the Pending user scheme
    const pendingUser = new PendingUser({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    await pendingUser.save();

    //jwt
    // generateTokenAndSetCookie(res, user._id);

    // await sendVerificationEmail(user.email, verificationToken);

    await sendVerificationEmail(pendingUser.email, verificationToken);

    // res.status(201).json({
    //   success: true,
    //   message: "User created successfully",
    //   user: {
    //     ...user._doc,
    //     password: undefined,
    //     verificationToken: undefined,
    //     verificationTokenExpiresAt: undefined,
    //   },
    // });

    res.status(201).json({
      success: true,
      message:
        "Verification email sent. Please verify your email to complete registration.",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    // const user = await User.findOne({
    //   verificationToken: code,
    //   verificationTokenExpiresAt: { $gt: Date.now() },
    // });

    // if (!user) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid or expired verification code",
    //   });
    // }

    // Find the user from the PendingUser collection
    //also check the verification code is not expired by using the $gt (greater than) Date.now()
    const pendingUser = await PendingUser.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Move the user to the User collection
    const newUser = new User({
      email: pendingUser.email,
      password: pendingUser.password,
      name: pendingUser.name,
      isVerified: true,
      isGoogleUser: false,
    });

    await newUser.save();

    // Remove the user from PendingUser collection after successful verification
    await PendingUser.deleteOne({ email: pendingUser.email });

    // user.isVerified = true;
    // user.verificationToken = undefined;
    // user.verificationTokenExpiresAt = undefined;

    // await user.save();

    // await sendWelcomeEmail(user.email, user.name);

    await sendWelcomeEmail(newUser.email, newUser.name);

    const token = generateTokenAndSetCookie(res, newUser._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...newUser._doc,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    console.log("Error in verifyEmail: ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
      user: {
        ...user._doc,
        password: undefined,
        verificationToken: undefined,
        verificationTokenExpiresAt: undefined,
      },
    });
  } catch (error) {
    console.log("Error in sending verification email: ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error("All fields are required!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // Check if the user is a Google user
    if (user.isGoogleUser) {
      return res.status(400).json({
        success: false,
        message:
          "This email is registered via Google. Please use Google Sign-In.",
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw Error("Email is required!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist!" });
    }

    //generateResetToken
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //After 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //sentn password reset email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // req.userId was set by previous method (middleware function verifyToken) by decoding the token
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const googleAuthSignup = async (req, res) => {
  const authUrl = googleAuthClient.generateAuthUrl({
    access_type: "offline", // 'offline' to get a refresh token if needed
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ], // Permissions requested from the user
  });
  res.redirect(authUrl); // Redirect the user to Google's OAuth login page
};

export const googleAuthCallback = async (req, res) => {
  const { code } = req.query;

  try {
    // Step 1: Exchange the authorization code for tokens
    const { tokens } = await googleAuthClient.getToken(code);
    console.log("tokens: ", tokens);

    // Step 2: Verify the ID token from the tokens response
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log("ticket: ", ticket);

    // Step 3: Extract user info from the token payload
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // Step 4: Check if user exists by email (this handles regular users too)
    let user = await User.findOne({ email });

    console.log("user: ", user);
    if (user) {
      if (!user.isGoogleUser) {
        // Case: User signed up with email/password, but now trying with Google
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=EmailAlreadyRegistered`
        );
      }
      // If user exists and is a Google user, you can just proceed with login
    } else {
      // If no user exists, create a new Google user
      user = new User({
        email,
        name,
        googleId,
        isGoogleUser: true,
        isVerified: true, // Since we're using Google OAuth, user is verified
        profilePicture: picture,
      });
      await user.save();

      // Step 4.5
      await sendWelcomeEmail(user.email, user.name);
    }

    // Step 5: Generate JWT and set cookie
    const token = generateTokenAndSetCookie(res, user._id);

    // Step 6: Redirect the user back to the frontend
    const userObj = {
      ...user._doc,
      password: undefined,
    };

    const userString = encodeURIComponent(JSON.stringify(userObj));

    res.redirect(
      `${process.env.CLIENT_URL}/?token=${token}&user=${userString}`
    );
  } catch (error) {
    console.error("Error during Google OAuth:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};
