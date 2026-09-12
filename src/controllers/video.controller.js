import { Mongoose } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { uploadOncloudinary } from "../utils/cloudinary.js";
import { comment } from "postcss";

const getAllVideos = asyncHandler(async (req, res) => {
  const video = await Video.findOne({});

  res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { Videoid } = req.params;
  const video = await Video.findById(Videoid);

  if (!video) {
    throw new ApiError(404, "video not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "Video updated successfully"
            )
        );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedVideo,
                "Video deleted successfully"
            )
        );
});
export { getAllVideos, getVideoById, updateVideo, deleteVideo };
