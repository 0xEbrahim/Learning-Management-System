import { NextFunction, Response } from "express";
import stripe from "../../config/stripe";
import { IRequest } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import OrderService from "./Order.service";
import { ICheckoutBody, IWebhookBody } from "./Order.interface";

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
    });
  }
);
export const verifyOrder = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    if (req.query.q === "true") {
      res.status(200).json({
        message: "Purchasing done successfully.",
      });
    } else {
      res.status(200).json({
        message: "Purchasing did not complete.",
      });
    }
  }
);

export const webhooks = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const data: IWebhookBody = {
      req,
    };
    const result = await OrderService.webhook(data);
    res.send().end();
  }
);
