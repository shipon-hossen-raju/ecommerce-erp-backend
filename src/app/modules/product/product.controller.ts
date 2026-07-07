import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { checkMongodbID } from "../../../utils/checkMongodbId";
import { productService } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product image is required");
  }

  const result = await productService.createProduct(req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await productService.getAllProducts(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    meta,
    data,
  });
});

const getProductCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getProductCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product categories retrieved successfully",
    data: result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getProductById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const productId = checkMongodbID(req.params.id);
  console.log("updateProduct productId ", productId);

  const result = await productService.updateProduct(productId, req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = checkMongodbID(req.params.id);
  await productService.deleteProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: null,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
  getProductCategories,
  getProductById,
  updateProduct,
  deleteProduct,
};
