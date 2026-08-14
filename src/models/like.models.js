import mongoose, {Schema} from 'mongoose';

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },

    

},
{timestamps: true});

export const Like = mongoose.model("Like",
    likeSchema
)