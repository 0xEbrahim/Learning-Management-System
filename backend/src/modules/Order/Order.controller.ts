import { NextFunction, Response } from "express";
import { IRequest } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import OrderService from "./Order.service";
import sendResponse from "../../utils/sendResponse";

export const createCheckoutSession = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data = {};
    const result = await OrderService.createCheckoutSession(data);
    res.status(303).json({
      message: "Redirecting",
      session: result,
    });
  }
);
