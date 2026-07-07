import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { dashboardService } from "./dashboard.service";

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getStats(req.user.role, req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});

const getSalesTrend = catchAsync(async (req: Request, res: Response) => {
  const days = Number(req.query.days) || 30;
  const result = await dashboardService.getSalesTrend(days);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sales trend retrieved successfully",
    data: result,
  });
});

const getTopProducts = catchAsync(async (req: Request, res: Response) => {
  const days = Number(req.query.days) || 30;
  const limit = Number(req.query.limit) || 5;
  const result = await dashboardService.getTopProducts(days, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Top products retrieved successfully",
    data: result,
  });
});

export const dashboardController = {
  getStats,
  getSalesTrend,
  getTopProducts,
};
