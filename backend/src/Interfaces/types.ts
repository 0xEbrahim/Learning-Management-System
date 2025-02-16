import { JwtPayload } from "jsonwebtoken";

export interface IReponse {
  status: string;
  statusCode: number;
  message: string;
  data?: object;
  token?: string;
}

export interface IToken extends JwtPayload{
  id: string;
  loggedIn?: boolean;
  iat: number;
}
