import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest } from "../../Interfaces/types";
import NotificationsService from "./Notifications.service";
import sendResponse from "../../utils/sendResponse";

export const getNotifications = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data = req.User?.id as string;
    const result = await NotificationsService.getNotifications(data);
    sendResponse(result, res);
  }
);
