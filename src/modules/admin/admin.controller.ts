import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import {
  IAdminPropertyQuery,
  IAdminRentalQuery,
  IAdminUserQuery,
} from "./admin.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsers(
      req.query as IAdminUserQuery,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.updateUserStatus(
      req.params.id as string,
      req.body.status as UserStatus,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: result,
    });
  },
);

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllProperties(
      req.query as IAdminPropertyQuery,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getAllRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRentalRequests(
      req.query as IAdminRentalQuery,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};
