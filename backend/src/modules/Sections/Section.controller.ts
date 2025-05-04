import { NextFunction, Response } from "express";
import { IRequest, IResponse } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import {
  ICreateSectionBody,
  IDeleteSectionBody,
  IGetSectionByIdBody,
  IGetSectionsBody,
} from "./Section.interface";
import SectionService from "./Section.service";
import sendResponse from "../../utils/sendResponse";

export const createSection = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: ICreateSectionBody = {
      courseId: req.body.courseId,
      name: req.body.name,
      userId: req.User?.id ?? "",
    };
    const result: IResponse = await SectionService.createSection(data);
    sendResponse(result, res);
  }
);

export const getSections = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetSectionsBody = {
      courseId: req.body.courseId,
    };
    const result: IResponse = await SectionService.getSections(data);
    sendResponse(result, res);
  }
);

export const getSectionById = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetSectionByIdBody = {
      courseId: req.body.courseId,
      sectionId: req.params.id,
    };
    const result = await SectionService.getSectionById(data);
    sendResponse(result, res);
  }
);

export const deleteSection = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IDeleteSectionBody = {
      courseId: req.body.courseId,
      sectionId: req.params.id,
      userId: req.User?.id ?? "",
    };
    const result = await SectionService.deleteSection(data);
    sendResponse(result, res);
  }
);
