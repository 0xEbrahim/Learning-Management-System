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

export interface IAddReviewNotificationData {
  authorId: string;
  reviewId: string;
  courseName: string;
  courseId: string;
}

export interface IMessageData {
  message: string;
  senderId: string;
  receiverId: string;
  roomId?: string;
  private: boolean;
}

export interface IMessageNotificationData {
  receiverId: string;
  senderId: string;
  text: string;
  chatId: string;
}
