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
import APIError from "../../utils/APIError";

export const createSection = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.User?.id) {
      throw new APIError("User not authenticated", 401);
    }

    const data: ICreateSectionBody = {
      courseId: req.params.courseId,
      name: req.body.name,
      userId: req.User.id,
    };

    const result = await SectionService.createSection(data);
    sendResponse(result, res);
  }
);

export const getSections = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetSectionsBody = {
      courseId: req.params.courseId,
    };

    const result = await SectionService.getSections(data);
    sendResponse(result, res);
  }
);

export const getSectionById = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IGetSectionByIdBody = {
      courseId: req.params.courseId,
      sectionId: req.params.id,
    };

    const result = await SectionService.getSectionById(data);
    sendResponse(result, res);
  }
);

export const deleteSection = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.User?.id) {
      throw new APIError("User not authenticated", 401);
    }

    const data: IDeleteSectionBody = {
      courseId: req.params.courseId,
      sectionId: req.params.id,
      userId: req.User.id,
    };

    const result = await SectionService.deleteSection(data);
    sendResponse(result, res);
  }
);
