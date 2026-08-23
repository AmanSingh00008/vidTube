import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const Token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!Token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);

    await User.findById().select("-password -refreshToken");

    if (!User) {
      throw new ApiError(401, "Unauthorized");
    }

    req.User = User;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid access Token");
  }
});
