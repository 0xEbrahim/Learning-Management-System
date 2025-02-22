import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest, IResponse } from "../../Interfaces/types";
import { ICreateCourseBody, IDeleteCourseBody } from "./Course.interface";
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

export const getCourseById = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result: IResponse = await CourseService.getCourseById(id);
    sendResponse(result, res);
  }
);

export const getCourses = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const result: IResponse = await CourseService.getCourses(req.query);
    sendResponse(result, res);
  }
);

export const search = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { query } = req;
    const result: IResponse = await CourseService.search(query);
    sendResponse(result, res);
  }
);

export const deleteCourse = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IDeleteCourseBody = {
      id: req.User?.id as string,
      courseId: req.params.id,
    };
    const result: IResponse = await CourseService.deleteCourse(data);
    sendResponse(result, res);
  }
);
