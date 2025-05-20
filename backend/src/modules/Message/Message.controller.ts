import { NextFunction, Response } from "express";
import { IRequest, IResponse } from "../../Interfaces/types";
import asyncHandler from "../../utils/asyncHandler";
import MessageService from "./Message.service";
import sendResponse from "../../utils/sendResponse";

export const getAllMessages = asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const result: IResponse = await MessageService.getAllMessagesAtPrvChat(
      req.params.id
    );
    sendResponse(result, res);
  }
);
