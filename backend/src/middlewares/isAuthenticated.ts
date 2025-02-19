import { NextFunction, Response, Request } from "express";
import asyncHandler from "../utils/asyncHandler";
import { IRequest, IToken } from "../Interfaces/types";
import APIError from "../utils/APIError";
import { verifyToken } from "../utils/JWT/token";
import prisma from "../config/prisma";
import { IUser } from "../modules/User/User.interface";

export default asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      return next(new APIError("Please login to access this route", 403));
    }
    if (!header.startsWith("Bearer"))
      return next(new APIError("Invalid token", 400));
    const token = header.split(" ")[1];
    const decoded: IToken = verifyToken(token);
    if (!decoded) return next(new APIError("Invalid or expired token", 400));
    const user: IUser | null = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return next(new APIError("Invalid or expired token", 400));
    req.User = user;
    next();
  }
);
