import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { categoryService } from "./category.service";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.createCategory(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategories();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    });
  },
);

const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    const result = await categoryService.getSingleCategory(
      categoryId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    });
  },
);
const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    if (!categoryId) {
      throw new Error("Category Id required in params");
    }
    const payload = req.body;
    const result = await categoryService.updateCategory(
      categoryId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories Updated successfully",
      data: result,
    });
  },
);
const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    if (!categoryId) {
      throw new Error("Category Id required in params");
    }
    const result = await categoryService.deleteCategory(
      categoryId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories Deleted successfully",
      data: result,
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
};
