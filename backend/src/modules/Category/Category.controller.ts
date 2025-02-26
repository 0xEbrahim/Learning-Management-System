import { NextFunction, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { ICreateCategoryBody, IGetCategoryBody } from "./Category.interface";
import { IRequest, IResponse } from "../../Interfaces/types";
import CategoryService from "./Category.service";
import sendResponse from "../../utils/sendResponse";

export const createCategory = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: ICreateCategoryBody = {
      name: req.body.name,
    };
    const result: IResponse = await CategoryService.createCategory(data);
    sendResponse(result, res);
  }
);

export const getCategories = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const result: IResponse = await CategoryService.getCategories(req.query);
    sendResponse(result, res);
  }
);

export const getCategoryById = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetCategoryBody = {
      id: req.params.id,
    };
    const result: IResponse = await CategoryService.getCategoryById(data);
    sendResponse(result, res);
  }
);
