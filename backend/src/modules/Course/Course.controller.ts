import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest, IResponse } from "../../Interfaces/types";
import {
  ICreateCourseBody,
  IDeleteCourseBody,
  IGetCoursesBody,
  IGetCoursesByIdBody,
} from "./Course.interface";
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
      categories: req.body.categories,
    };
    const result: IResponse = await CourseService.createCourse(data);
    sendResponse(result, res);
  }
);

export const getCourseById = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetCoursesByIdBody = {
      id: req.params.id,
      categoryId: req.params.categoryId,
    };
    const id = req.params.id;
    const result: IResponse = await CourseService.getCourseById(data);
    sendResponse(result, res);
  }
);

export const getCourses = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetCoursesBody = {
      query: req.query,
      categoryId: req.params.categoryId,
    };
    const result: IResponse = await CourseService.getCourses(data);
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

/**
 TODO:
  - Update course
  - Update course thumbnail
  - Course Categories Management
  - Course Statistics Controller
 */