import { NextFunction, Request, Response } from "express";
import ms from "ms";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import config from "../../config";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.registerUserIntoDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Registerd Successfylly.",
      data: user,
    });
  },
);

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = await authService.loginUserIntoDB(
      req.body,
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: ms(config.jwt_access_expires_in as ms.StringValue),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: ms(config.jwt_refresh_expires_in as ms.StringValue),
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged in successfully!",
      data: { accessToken },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = await authService.getMyProfileFromDB(
      req.user?.id as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile fetch successfully!",
      data: {
        profile,
      },
    });
  },
);

export const authController = {
  registerUser,
  loginUser,
  getMyProfile,
};
