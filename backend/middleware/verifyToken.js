import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - invalid token" });

    //get the userId which is hidden inside the token
    req.userId = decoded.userId;

    //call the next function in the router.get() method
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
