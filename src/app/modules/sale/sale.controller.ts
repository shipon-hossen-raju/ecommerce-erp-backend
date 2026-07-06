import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { saleService } from "./sale.service";

const createSale = catchAsync(async (req: Request, res: Response) => {
  const result = await saleService.createSale({
    items: req.body.items,
    soldBy: req.user.id,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sale created successfully",
    data: result,
  });
});

const getAllSales = catchAsync(async (req: Request, res: Response) => {
  const result = await saleService.getAllSales();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sales retrieved successfully",
    data: result,
  });
});

export const saleController = {
  createSale,
  getAllSales,
};
