import { Response } from "express";
import { IResponse } from "../Interfaces/types";
import config from "../config/env";

export default (data: IResponse, res: Response) => {
  if (data.refreshToken) {
    res.cookie("token", data.refreshToken, {
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }
  res.status(data.statusCode).json({
    status: data.status,
    size: data.size,
    message: data.message,
    data: data.data,
    token: data.token,
  });
};
