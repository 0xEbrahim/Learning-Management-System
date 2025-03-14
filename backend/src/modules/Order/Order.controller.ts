import { NextFunction, Response } from "express";
import { IRequest } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import OrderService from "./Order.service";
import { ICheckoutBody } from "./Order.interface";

export const createCheckoutSession = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: ICheckoutBody = {
      courseId: req.body.courseId,
      userId: req.User?.id as string,
    };
    const result = await OrderService.createCheckoutSession(data);
    res.status(303).json({
      message: "Redirecting",
      url: result.session.url,
      order: result.order,
    });
  }
);
export const verifyOrder = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    res.json(req.body);
  }
);
