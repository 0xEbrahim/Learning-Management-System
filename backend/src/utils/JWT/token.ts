import jwt from "jsonwebtoken";
import config from "../../config/env";
import { IToken } from "../../Interfaces/types";
export const generateToken = (id: string, loggedIn: boolean): string => {
  const token: string = jwt.sign(
    { id, loggedIn },
    config.JWT_SECRET as string,
    {
      expiresIn: `${config.JWT_EXPIRES_IN}m`,
    }
  );
  return token;
};

export const generateRefreshToken = (id: string): string => {
  const token: string = jwt.sign({ id }, config.REFRESH_SECRET as string, {
    expiresIn: `30d`,
  });
  return token;
};

export const verifyToken = (token: string): IToken => {
  const decoded: IToken = jwt.verify(
    token,
    config.JWT_SECRET as string
  ) as IToken;
  return decoded;
};

export const verifyRefreshToken = (token: string): IToken => {
  const decoded: IToken = jwt.verify(
    token,
    config.REFRESH_SECRET as string
  ) as IToken;
  return decoded;
};
