import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../modules/User/User.interface";

export interface IResponse {
  status: string;
  size?: number;
  statusCode: number;
  message?: string;
  data?: object;
  token?: string;
  refreshToken?: string;
  pages?: number;
}

export interface IRequest extends Request {
  User?: IUser;
}
export interface IEmail {
  email: string;
  subject: string;
  template: string;
}

export interface IToken extends JwtPayload {
  id: string;
  loggedIn?: boolean;
  iat: number;
}
