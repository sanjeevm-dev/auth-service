import jwt from "jsonwebtoken";

export const genCookies = async (user) => {
  try {
    // generate  access token and refresh token
    const accessToken = await jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: "60m",
      }
    );
    const refreshToken = await jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1y",
      }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error in genCookies", error);
  }
};
