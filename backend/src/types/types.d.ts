import * as express from "express";
import { IUser } from "../modules/User/User.interface";

declare global {
  namespace Express {
    interface Request {
      User?: IUser;
    }
  }
}
