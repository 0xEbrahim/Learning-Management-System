import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest } from "../../Interfaces/types";
import prisma from "../../config/prisma";

export const getNotifications = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const notifications = await prisma.notification.findMany({
      where: {
        recieverId: req.User?.id as string,
      },
    });
    res.json(notifications);
  }
);
