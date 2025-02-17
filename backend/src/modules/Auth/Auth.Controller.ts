import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AuthService from "./Auth.Service";
import { IRegisterBody } from "./Auth.Interface";
import logger from "../../config/logger";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data: IRegisterBody = req.body as IRegisterBody;
    if (req.file) {
      data.avatar = req.file.path;
    }
    const result: string = await AuthService.register(data);
    res.status(201).json({
      status: "Success",
      message: result,
    });
  }
);

export const sendEmailVerificationToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const verifyEmailVerificationToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const result = await AuthService.verifyEmail(token);
    res.status(200).json({
      status: "Success",
      message: result,
    });
  }
);
