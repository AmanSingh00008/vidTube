import { Mongoose } from "mongoose";
import {asynHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import {uploadOncloudinary} from "../utils/cloudinary.js"


const getAllVideos = asynHandler(async(req , res) => {
    const video = await video.findOne({});
    
    
    res 
      .status(200)
      .json(new ApiResponse(200, video, "video fetched successfully"))

    


})

const getVideoById = asynHandler(async(req , res) => {  
       
})


