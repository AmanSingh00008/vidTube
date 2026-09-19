import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {playlist} from "../models/playlist.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const newPlaylist = await playlist.create({ name, description });
    return res.status(201).json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const playlistData = await playlist.findById(playlistId);
    if (!playlistData) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, playlistData, "Playlist fetched successfully"));
}); 

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    const updatedPlaylist = await playlist.findByIdAndUpdate(playlistId, { name, description }, { new: true }); 
    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const deletedPlaylist = await playlist.findByIdAndDelete(playlistId);
    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"));
});

export { createPlaylist, getPlaylistById, updatePlaylist, deletePlaylist };