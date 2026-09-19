import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {subscription} from "../models/subscription.models.js";


const getAllSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await subscription.find({});
    return res.status(200).json(new ApiResponse(200, subscriptions, "Subscriptions fetched successfully"));
});

const getSubscriptionById = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;
    const subscriptionData = await subscription.findById(subscriptionId);
    if (!subscriptionData) {
        throw new ApiError(404, "Subscription not found");
    }
    return res.status(200).json(new ApiResponse(200, subscriptionData, "Subscription fetched successfully"));
});

const updateSubscription = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;
    const { name, price } = req.body;
    const updatedSubscription = await subscription.findByIdAndUpdate(subscriptionId, { name, price }, { new: true });
    if (!updatedSubscription) {
        throw new ApiError(404, "Subscription not found");
    }
    return res.status(200).json(new ApiResponse(200, updatedSubscription, "Subscription updated successfully"));
});

const deleteSubscription = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;
    const deletedSubscription = await subscription.findByIdAndDelete(subscriptionId);
    if (!deletedSubscription) {
        throw new ApiError(404, "Subscription not found");
    }
    return res.status(200).json(new ApiResponse(200, deletedSubscription, "Subscription deleted successfully"));
});

export { getAllSubscriptions, getSubscriptionById, updateSubscription, deleteSubscription };