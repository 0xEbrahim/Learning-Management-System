import { JwtPayload } from "jsonwebtoken";

export interface IReponse {
  status: string;
  statusCode: number;
  message?: string;
  data?: object;
  token?: string;
  refreshToken?: string;
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
