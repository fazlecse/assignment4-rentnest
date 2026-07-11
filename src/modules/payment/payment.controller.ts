import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { paymentService } from "./payment.service";
import { IPaymentQuery } from "./payment.interface";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.createCheckoutSession(
      req.user?.id as string,
      req.body.rentalRequestId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  await paymentService.handleWebhook(req.body, signature);

  res.status(200).json({
    received: true,
  });
});

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.getMyPayments(
      req.user?.id as string,
      req.query as IPaymentQuery,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getSinglePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.getSinglePayment(
      req.user?.id as string,
      req.user?.role as string,
      req.params.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getSinglePayment,
};
