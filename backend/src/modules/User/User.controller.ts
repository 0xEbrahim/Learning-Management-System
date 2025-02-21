import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { IRequest, IResponse } from "../../Interfaces/types";
import UserService from "./User.service";
import sendResponse from "../../utils/sendResponse";
import { IUser } from "./User.interface";

export const getUserById = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result: IResponse = await UserService.getUserById(id);
    sendResponse(result, res);
  }
);

export const getUserProfile = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const id = req.User?.id as string;
    const result: IResponse = await UserService.getUserById(id);
    sendResponse(result, res);
  }
);

export const getUsers = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const result: IResponse = await UserService.getUsers(req.query);
    sendResponse(result, res);
  }
);

export const search = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { query } = req;
    const result: IResponse = await UserService.search(query);
    sendResponse(result, res);
  }
);
