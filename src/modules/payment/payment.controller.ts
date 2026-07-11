import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { paymentService } from "./payment.service";

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

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
};
