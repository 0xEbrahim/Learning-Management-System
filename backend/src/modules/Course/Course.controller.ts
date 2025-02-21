import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest } from "../../Interfaces/types";
import { ICreateCourseBody } from "./Course.interface";

export const createCourse = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data : ICreateCourseBody = {
        publisherId: req.User?.id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        
    }
  }
);
