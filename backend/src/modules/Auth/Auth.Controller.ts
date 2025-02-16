import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import AuthService from "./Auth.Service";
import { IRegisterBody } from "./Auth.Interface";
import sendResponse from "../../utils/sendResponse";
import { IReponse } from "../../Interfaces/types";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data : IRegisterBody = req.body as IRegisterBody;
    if(req.file){
        data.avatar = req.file.path;
    } 
    const result = await AuthService.register(data)
  }
);
