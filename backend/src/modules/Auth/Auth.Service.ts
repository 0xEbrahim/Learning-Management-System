import fs from "fs";
import crypto from "crypto";
import prisma from "../../config/prisma";
import { ICallBackReturn, ILoginBody, IRegisterBody } from "./Auth.Interface";
import cloudinary from "../../config/cloudinary";
import logger from "../../config/logger";
import APIError from "../../utils/APIError";
import {
  cleanUsersData,
  comparePassword,
  createEmailVerifyToken,
  createResetPasswordToken,
  hashPassword,
} from "../../utils/Functions/functions";
import { IResponse } from "../../Interfaces/types";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "../../utils/JWT/token";
import { IUser } from "../User/User.interface";

class AuthService {
  async register(Payload: IRegisterBody): Promise<string> {
    const isExist = await prisma.user.findUnique({
      where: {
        email: Payload.email,
      },
    });
    if (isExist) {
      throw new APIError("Email is already exists, try another email.", 409);
    }
    let avatar;
    if (Payload.avatar) {
      avatar = await cloudinary.uploader.upload(Payload.avatar, {
        folder: "Users",
      });
      logger.info("Avatar uploaded to the cloud.");
      fs.unlinkSync(Payload.avatar);
    }
    const hashedPassword = await hashPassword(Payload.password);
    const user = await prisma.user.create({
      data: {
        name: Payload.name,
        email: Payload.email,
        password: hashedPassword,
        avatar: avatar?.secure_url,
      },
    });
    if (!user) {
      throw new APIError("Error while creating account, please try again", 500);
    }
    await createEmailVerifyToken(user);
    logger.info("User account created successfully, user ID: " + user.id);
    return "Account created successfully, please check your Gmail account to verify your email";
  }

  async login(Payload: ILoginBody): Promise<IResponse> {
    const { email, password } = Payload;
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
    };
    const user: IUser | null = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user || !(await comparePassword(password, user.password as string))) {
      throw new APIError("Incorrect email or password.", 401);
    }
    if (!user.emailVerified) {
      logger.info("User's email is not verified. ID: " + user.id);
      response.message =
        "Your email is not verified, please check your email to verifiy it.";
      response.status = "Error";
      response.statusCode = 403;
      await createEmailVerifyToken(user);
      return response;
    }
    const token = generateToken(user.id, true);
    const refreshToken = generateRefreshToken(user.id);
    cleanUsersData(user);
    response.data = { user };
    response.token = token;
    response.refreshToken = refreshToken;
    logger.info("User login to the website, ID: " + user.id);
    return response;
  }

  async refresh(Payload: any): Promise<IResponse> {
    if (!Payload) {
      throw new APIError("Expired session, please login again", 498);
    }
    const decoded = verifyRefreshToken(Payload);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      throw new APIError("Invalid or expired token", 498);
    }
    const accessToken = generateToken(user.id, true);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      token: accessToken,
    };
    return response;
  }

  async verifyEmail(Payload: string): Promise<string> {
    const hashed = crypto.createHash("sha256").update(Payload).digest("hex");
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: hashed,
        emailVerificationTokenExpiresAt: { gt: new Date(Date.now()) },
      },
    });
    if (!user) {
      throw new APIError("Invalid or expired token", 400);
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
        emailVerified: true,
      },
    });
    if (!updatedUser) {
      throw new APIError("Error while verifiying user's email", 500);
    }
    logger.info("Email verified successfully for user ID: " + user.id);
    return "Email verified, now you can login to your account.";
  }

  async sendEmailToken(Payload: any): Promise<string> {
    const user = await prisma.user.findUnique({
      where: {
        email: Payload,
      },
    });
    if (!user) {
      throw new APIError("Invalid email, cannot find user.", 404);
    }
    await createEmailVerifyToken(user);
    return "Email sent successfully, please check your Gmail account to verify your email";
  }

  async handleCallBack(Payload: any): Promise<ICallBackReturn> {
    const RefreshToken = generateRefreshToken(Payload as string);
    const token = generateToken(Payload as string, true);
    const ret: ICallBackReturn = {
      token,
      refreshToken: RefreshToken,
    };
    return ret;
  }

  async forgotPassword(Payload: string) {
    const user = await prisma.user.findUnique({
      where: {
        email: Payload,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      message: "Please check your email for reset password link",
    };
    if (!user) {
      logger.error("User used " + Payload + " to get reset password link");
      return response;
    }
    await createResetPasswordToken(user as IUser);
    return response;
  }
  /**
   * 
   * TODO: 
   *  reset password
   *  verify reset password token
   */
  async resetPassword(Payload: any) {}
  async verifyResetPasswordToken(Payload: any) {}
}

export default new AuthService();
