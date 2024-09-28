import mongoose from "mongoose";

//  PendingUser model to store unverified users temporarily.

const PendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  verificationToken: { type: String, required: true },
  verificationTokenExpiresAt: { type: Date, required: true },
});

export const PendingUser = mongoose.model("PendingUser", PendingUserSchema);
