import { Response } from "express";
import config from "../config/env";
import { IReponse } from "../Interfaces/types";

export default (data: IReponse, res: Response) => {
  if (data.refreshToken) {
    res.cookie("token", data.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: config.NODE_ENV === "production",
      httpOnly: true,
    });
  }
  res.status(data.statusCode).json({
    status: data.status,
    message: data.message,
    data: data.data,
    token: data.token,
  });
};
