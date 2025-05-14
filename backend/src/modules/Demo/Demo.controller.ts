import { NextFunction, Response } from "express";
import { IRequest, IResponse } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import { IUploadDemoBody } from "./Demo.interface";
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
