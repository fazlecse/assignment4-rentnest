import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      // res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      //   statusCode: httpstatus.INTERNAL_SERVER_ERROR,
      //   success: false,
      //   message: error.message,
      //   error: error.stack,
      // });
      next(error);
    }
  };
};
