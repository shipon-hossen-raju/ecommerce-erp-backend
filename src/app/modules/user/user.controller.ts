import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { checkMongodbID } from "../../../utils/checkMongodbId";
import { userService } from "./user.service";

// POST /users - create a new user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

// GET /users - list all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

// GET /users/:id - fetch a single user
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = checkMongodbID(req.params.id);
  const result = await userService.getUserById(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

// PATCH /users/:id - update a user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = checkMongodbID(req.params.id);
  const result = await userService.updateUser(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

// DELETE /users/:id - remove a user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = checkMongodbID(req.params.id);
  await userService.deleteUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: null,
  });
});

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
