import { Response } from "express";
import { IResponse } from "../Interfaces/types";
import config from "../config/env";

export default (data: IResponse, res: Response) => {
  if (data.refreshToken) {
    res.cookie("token", data.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
    });
  }
  if (data.message === "You have been logged out successfully.")
    res.clearCookie("token");
  res.status(data.statusCode).json({
    status: data.status,
    message: data.message,
    data: data.data,
    token: data.token,
  });
};
