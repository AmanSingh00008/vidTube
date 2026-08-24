import { Router } from "express";
import { registerUser, logoutUser } from "../controllers/user.controllers.js";
import { Upload } from "./middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
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

router.route("/logout").post(verifyJWT, logoutUser)



export default router;
