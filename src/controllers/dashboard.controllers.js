import {asyncHandler} from "../utils/asyncHandler.js";
import {dashboardModel} from "../models/dashboard.model.js";
import {ApiError} from "../utils/ApiError.js";

const getDashboardData = asyncHandler(async (req, res) => {

    const dashboardData = await dashboardModel.getDashboardData();
    res.status(200).json({
        success: true,
        data: dashboardData
    });
});

const getDashboardStats = asyncHandler(async (req, res) => {
    const dashboardStats = await dashboardModel.getDashboardStats();
    res.status(200).json({
        success: true,
        data: dashboardStats
    });
});

const getDashboardSummary = asyncHandler(async (req, res) => {
    const dashboardSummary = await dashboardModel.getDashboardSummary();
    res.status(200).json({  
        success: true,
        data: dashboardSummary
    });
});

const getDashboardMetrics = asyncHandler(async (req, res) => {
    const dashboardMetrics = await dashboardModel.getDashboardMetrics();
    res.status(200).json({
        success: true,
        data: dashboardMetrics
    });
});

export {getDashboardData, getDashboardStats, getDashboardSummary, getDashboardMetrics};