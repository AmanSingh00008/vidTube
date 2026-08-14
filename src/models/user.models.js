import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  avatar: {
    type: String,
    required: true,
    // default: "https://res.cloudinary.com/dxj0gqv1f/image/upload/v1690911685/default-avatar_ow7k6b.png"
  },
  coverImage: {
    type: String,

    // default: "https://res.cloudinary.com/dxj0gqv1f/image/upload/v1690911685/default-cover-image_ow7k6b.png"
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  },
});
{
  timestamps: true;
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, 10);
  next();
  
});

export const User = mongoose.model("User", userSchema);
