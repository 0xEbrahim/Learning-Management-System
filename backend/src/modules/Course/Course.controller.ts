import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest, IResponse } from "../../Interfaces/types";
import { ICreateCourseBody } from "./Course.interface";
import CourseService from "./Course.service";
import sendResponse from "../../utils/sendResponse";

export const createCourse = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: ICreateCourseBody = {
      publisherId: req.User?.id as string,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      thumbnail: req.file?.path as string,
    };
    const result: IResponse = await CourseService.createCourse(data);
    sendResponse(result, res);
  }
);

