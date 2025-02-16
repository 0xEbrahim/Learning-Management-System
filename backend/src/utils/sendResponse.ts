import { Response } from "express";

export default (data: any, res: Response) => {
  res.status(data.statusCode).json({
    status: data.status,
    message: data.message,
    data: data.data,
    token: data.token,
  });
};
