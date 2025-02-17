import { Response } from "express";
import { IReponse } from "../Interfaces/types";

export default (data: IReponse, res: Response) => {
  res.status(data.statusCode).json({
    status: data.status,
    message: data.message,
    data: data.data,
    token: data.token,
  });
};
