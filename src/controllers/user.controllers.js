import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { jwt } from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  //validate user input
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarPath = req.files?.avatar?.[0]?.path;

  const coverImagePath = req.files?.coverImage?.[0]?.path;

  if (!avatarPath || !coverImagePath) {
    throw new ApiError(400, "Avatar and cover image are required");
  }

  const avatarUploadResponse = await uploadCloudinary(avatarPath);
  const coverImageUploadResponse = await uploadCloudinary(coverImagePath);

  if (!avatarUploadResponse || !coverImageUploadResponse) {
    throw new ApiError(500, "Failed to upload images to Cloudinary");
  }

  const user = await User.create({
    fullname,
    email,
    username,
    password,
    avatar: avatarUploadResponse.url,
    coverImage: coverImageUploadResponse.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while register a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully"));

  res.status(201).json({
    success: true,
    user: user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res.status(200).json(
    new ApiResponse(
      200,

      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    )
  );
});

const RefreshAccessToken = asyncHandler(async (req, res) => {
  const IncomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!IncomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  try {
    const decodedToken = jwt.verify(
      IncomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh token");
    }

    if (IncomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookies("accessToken", accessToken, option)
      .cookies("refreshToken", newRefreshToken, option)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token"
    );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.User._id,
    {
      $set: {
        refreshToken: "" || undefined,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV ==="production",
  }
  return res
   .status(200)
   .clearCookies("accessToken", options)
   .clearCookies("refreshToken", options)
   .json(new ApiResponse(200,{}, "user logged out successfully"))
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newpassword} = req.body;
    
    const user = await User.findById(req.user?._id)

   const isPasswordValid = user.isPasswordCorrect(oldPassword)

   if(!isPasswordValid){
    throw new ApiError(401, "old password is incorrect")
   }
  
   user.password = newpassword
   await user.save({validateBeforeSave: false})

   return res
   .status(200)
   .json(new ApiResponse(200, {}, "password change successfully"))

   
})

const getCurrentUser = asyncHandler(async(req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, "Current user Details"))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
  const {fullname, email} = req.body;

  if(!fullname || !email){
    throw new ApiError(400, "Fullname and email are required")
  }

 const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      fullname,
      email: email
    }
  },
  {new: true}
).select("-password -refreshToken")

return res
  .status(200)
  .json(new ApiResponse(200, user, "Account deatils updated successfully"))

})

const updateUserAvatar = asyncHandler(async(req, res) => {

  const avatarLocalPath = req.file?.path 
  const avatar = await uploadCloudinary(avatarLocalPath)
  if(!avatar.url){
    throw new ApiError(500, "Something went wrong while uploading avatar")
  }
 const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {new: true}
  ).select("-password -refreshToken")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updated successfully"))
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
  const coverImageLocalPath = req.file?.path

 if(!coverImageLocalPath){
  throw new ApiError(400, "File is Required")
 }
 const coverImage = await uploadCloudinary(coverImageLocalPath)
if(!coverImage.url){
    throw new ApiError(500, "Something went wrong while uploading coverImage")
  }
 const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {new: true}
  ).select("-password -refreshToken")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage Updated successfully"))

})

export { registerUser, loginUser, RefreshAccessToken ,logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar,updateUserCoverImage };
