import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  console.log("Construction cookie:", process.env.NODE_ENV);

  res.cookie("token", token, {
    httpOnly: true, //prevent XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // prevent csrf (cross site resource forgery)
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days valid
  });

  return token;
};
