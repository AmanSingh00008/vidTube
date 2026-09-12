import { Router } from "express";
import { getAllVideos, getVideoById } from "../controllers/video.controller.js";

const router = Router();

router.route("/getAllvideos").get(getAllVideos)
router.route("/getVideoById").get(getVideoById)
router.route("/updateVideo").put(updateVideo)


export default router;