import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Extract token from cookies
  const accessToken = req.cookies.accessToken || req.body.accessToken;
  // Error if no token
  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized, access token missing" });
  }

  // Verify and decode the access token
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    // Attach user details from the decoded token to req.user
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized, invalid or expired access token" });
  }
};

export default authMiddleware;
