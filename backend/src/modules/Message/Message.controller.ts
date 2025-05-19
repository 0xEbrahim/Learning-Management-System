import { NextFunction, Response } from "express";
import { IRequest } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";

export const sendMessage = asyncHandler(async(req: IRequest, res: Response, next: NextFunction) => {
    
})