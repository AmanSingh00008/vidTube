import { Router } from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getUserChannelProfile,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getWatchHistory
} from "../controllers/user.controllers.js";
import { Upload } from "./middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();
router.route("/register").post(
  Upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/refreshAccessToken").post(refreshAccessToken);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(changeCurrentPassword)
router.route("/current-user").post(verifyJWT,getCurrentUser)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar)
router.route("/coverimage").patch(verifyJWT, upload.single("coverimage"),updateUserCoverImage)

router.route("/watch-history").get(verifyJWT, getWatchHistory)
export default router;
