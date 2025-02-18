import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AuthService from "./Auth.Service";
import { ILoginBody, IRegisterBody } from "./Auth.Interface";
import config from "../../config/env";
import APIError from "../../utils/APIError";
import sendResponse from "../../utils/sendResponse";
import { IReponse } from "../../Interfaces/types";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data: IRegisterBody = req.body as IRegisterBody;
    if (req.file) {
      data.avatar = req.file.path;
    }
    const result: string = await AuthService.register(data);
    res.cookie("email", data.email, {
      maxAge: 24 * 60 * 60 * 1000,
      secure: config.NODE_ENV === "production",
      httpOnly: true,
    });
    res.status(201).json({
      status: "Success",
      message: result,
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result: IReponse = await AuthService.login(req.body as ILoginBody);
    if (result.statusCode === 403) {
      res.cookie("email", req.body.email, {
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === "production",
        httpOnly: true,
      });
    }
    sendResponse(result, res);
  }
);

export const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const result: IReponse = await AuthService.refresh(token);
    sendResponse(result, res);
  }
);

export const sendEmailVerificationToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.cookies.email;
    if (!email)
      throw new APIError("You are not allowed to use this endpoint", 403);
    const result = await AuthService.sendEmailToken(email);
    res.status(200).json({
      status: "Success",
      message: result,
    });
  }
);

export const verifyEmailVerificationToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const result = await AuthService.verifyEmail(token);
    res.clearCookie("email");
    res.status(200).json({
      status: "Success",
      message: result,
    });
  }
);

export const handleCallBack = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const ret = await AuthService.handleCallBack(req.user.id);
    res.cookie("token", ret, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const link =
      config.NODE_ENV === "development"
        ? `${config.DEV_URL}/users/me`
        : `${config.PROD_URL}/users/me`;
    res.redirect(link);
  }
);
