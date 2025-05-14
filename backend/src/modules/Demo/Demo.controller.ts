import { NextFunction, Response } from "express";
import { IRequest, IResponse } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import {
  IGetDemoBody,
  IUpdateDemoBody,
  IUploadDemoBody,
} from "./Demo.interface";
import DemoService from "./Demo.service";
import sendResponse from "../../utils/sendResponse";

export const uploadDemo = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IUploadDemoBody = {
      courseId: req.params.courseId,
      video: req.file?.path ?? "",
    };
    const result: IResponse = await DemoService.uploadDemo(data);
    sendResponse(result, res);
  }
);

export const getDemo = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetDemoBody = {
      courseId: req.params.courseId,
    };
    const result: IResponse = await DemoService.getOne(data);
    sendResponse(result, res);
  }
);

export const deleteDemo = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetDemoBody = {
      courseId: req.params.courseId,
    };
    const result: IResponse = await DemoService.deleteDemo(data);
    sendResponse(result, res);
  }
);

export const updateDemo = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IUpdateDemoBody = {
      courseId: req.params.courseId,
      video: req.file?.path ?? "",
    };
    const result: IResponse = await DemoService.updateOne(data);
    sendResponse(result, res);
  }
);
