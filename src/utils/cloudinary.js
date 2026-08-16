import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ddotenv from "dotenv";

ddotenv.config();

async function configureCloudinary() {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uplaod on cloudinary. File src: " + response.url);
    // once the file is uploaded on cloudinary, we would to delete it from the user
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadCloudinary };
