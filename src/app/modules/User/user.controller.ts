import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const result = await userServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

const getUser = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.getUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

const getUserProfile = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.getUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.updateUser(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully!",
    data: result,
  });
});

export const userControllers = {
  createUser,
  getUser,
  updateUser,
  getUserProfile,
};
