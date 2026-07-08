import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";
import { IRentalRequestQuery } from "./rental.interface";

const createRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalService.createRentalRequest(
      req.user?.id as string,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental request submitted successfully",
      data: result,
    });
  },
);

const getMyRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalService.getMyRentalRequests(
      req.user?.id as string,
      req.query as IRentalRequestQuery,
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

const getSingleRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalService.getSingleRentalRequest(
      req.user?.id as string,
      req.user?.role as string,
      req.params.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request retrieved successfully",
      data: result,
    });
  },
);

const getLandlordRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalService.getLandlordRentalRequests(
      req.user?.id as string,
      req.query as IRentalRequestQuery,
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

const updateRentalRequestStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalService.updateRentalRequestStatus(
      req.user?.id as string,
      req.params.id as string,
      req.body.status,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request status updated successfully",
      data: result,
    });
  },
);

export const rentalController = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
};
