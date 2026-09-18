import { Router } from "express";
import {
  createTweet,
  getAllTweets,
  updateTweet,
  deleteTweet,
  getUserTweets,
} from "../controllers/tweet.controller.js";

const router = Router();

router.route("/createTweet").post(createTweet);
router.route("/getAllTweets").get(getAllTweets);
router.route("/updateTweet").put(updateTweet);
router.route("/deleteTweet").delete(deleteTweet);
router.route("/getUserTweets").get(getUserTweets);

export default router;
