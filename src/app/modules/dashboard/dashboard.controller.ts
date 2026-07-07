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

export const dashboardController = {
  getStats,
};
