import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AuthService from "./Auth.Service";
import {
  ILoginBody,
  IRegisterBody,
  IResetPasswordBody,
} from "./Auth.Interface";
import config from "../../config/env";
import APIError from "../../utils/APIError";
import sendResponse from "../../utils/sendResponse";
import { IResponse } from "../../Interfaces/types";
import { cleanUsersData } from "../../utils/Functions/functions";

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

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result: IResponse = await AuthService.login(req.body as ILoginBody);
    sendResponse(result, res);
  }
);

export const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
      throw new APIError("Expired session, please login again", 403);
    }
    const result: IResponse = await AuthService.refresh(token);
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
    res.status(200).json({
      status: "Success",
      message: result,
    });
  }
);

export const handleCallBack = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { token, refreshToken } = await AuthService.handleCallBack(
      req.user.id
    );
    res.cookie("token", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    cleanUsersData(req.user);
    res.status(200).json({
      status: "Success",
      data: {
        user: req.user,
      },
      token,
    });
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    sendResponse(result, res);
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    const result: IResponse = await AuthService.logout(token as string);
    sendResponse(result, res);
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data: IResetPasswordBody = {
      token: req.body.token,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    const result: IResponse = await AuthService.resetPassword(data);
    sendResponse(result, res);
  }
);
