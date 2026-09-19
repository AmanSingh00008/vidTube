import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {like} from "../models/like.models.js";

const createLike = asyncHandler(async (req, res) => {
    const { userId, videoId } = req.body;
    const newLike = await like.create({ userId, videoId });
    return res.status(201).json(new ApiResponse(201, newLike, "Like created successfully"));
});

const getLikeById = asyncHandler(async (req, res) => {
    const { likeId } = req.params;
    const likeData = await like.findById(likeId);
    if (!likeData) {
        throw new ApiError(404, "Like not found");
    }
    return res.status(200).json(new ApiResponse(200, likeData, "Like fetched successfully"));
}); 

const updateLike = asyncHandler(async (req, res) => {
    const { likeId } = req.params;
    const { userId, videoId } = req.body;
    const updatedLike = await like.findByIdAndUpdate(likeId, { userId, videoId }, { new: true });
    if (!updatedLike) {
        throw new ApiError(404, "Like not found");
    }
    return res.status(200).json(new ApiResponse(200, updatedLike, "Like updated successfully"));
});

const deleteLike = asyncHandler(async (req, res) => {   
    const { likeId } = req.params;
    const deletedLike = await like.findByIdAndDelete(likeId);
    if (!deletedLike) {
        throw new ApiError(404, "Like not found");
    }
    return res.status(200).json(new ApiResponse(200, deletedLike, "Like deleted successfully"));
});

export { createLike, getLikeById, updateLike, deleteLike };
