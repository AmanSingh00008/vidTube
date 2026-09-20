import {asyncHandler} from "../utils/asyncHandler.js";
import {commentModel} from "../models/comment.model.js";

const createComment = asyncHandler(async (req, res) => {
    const {postId, userId, content} = req.body;
    const newComment = await commentModel.createComment(postId, userId, content);
    res.status(201).json({
        success: true,
        data: newComment
    });
});

const getComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const comment = await commentModel.getComment(commentId);
    res.status(200).json({
        success: true,
        data: comment
    });
});

export {createComment, getComment};