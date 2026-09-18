import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createTweet = asyncHandler(async (req, res) => {
  const { tweet } = req.body;

  if (!tweet) {
    throw new ApiError(400, "Tweet is required");
  }

  const newTweet = await Tweet.create({
    Tweet: tweet,
    User: req.user._id,
  });
  res
    .status(201)
    .json(new ApiResponse(201, newTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const tweets = await Tweet.find({ user: userId })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        tweets,
        "User tweets fetched successfully"
      )
    );
});

const getAllTweets = asyncHandler(async (req, res) => {
  const tweets = await tweets.find({})
    .sort({ createdAt: -1 })
    .populate("user", "username avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        tweets,
        "Tweets fetched successfully"
      )
    );
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweet } = req.body;
  const { tweetId } = req.params;

  if (!tweet?.trim()) {
    throw new ApiError(400, "Tweet is required");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        tweet: tweet.trim(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTweet,
        "Tweet updated successfully"
      )
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedTweet,
        "Tweet deleted successfully"
      )
    );
});

export { createTweet,
    getAllTweets,
    updateTweet,
    deleteTweet,
    getUserTweets
 };
