import mongoose,{Schema} from 'mongoose';

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscribedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscriptionDate: {
        type: Date,
        default: Date.now,
    },
},
{timestamps: true});

export const Subscription = mongoose.model("Subscription",
    subscriptionSchema
)