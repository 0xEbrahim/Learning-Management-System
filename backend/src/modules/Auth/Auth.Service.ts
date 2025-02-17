import fs from "fs";
import crypto from "crypto";
import prisma from "../../config/prisma";
import { IRegisterBody } from "./Auth.Interface";
import cloudinary from "../../config/cloudinary";
import logger from "../../config/logger";
import APIError from "../../utils/APIError";
import {
  createEmailVerifyToken,
  hashPassword,
} from "../../utils/Functions/functions";

class AuthService {
  async register(Payload: IRegisterBody): Promise<string> {
    const isExist = await prisma.user.findUnique({
      where: {
        email: Payload.email,
      },
    });
    if (isExist) {
      logger.error("Error while creating account, email already exists.");
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
      logger.error("Error while creating a new user");
      throw new APIError("Error while creating account, please try again", 500);
    }
    await createEmailVerifyToken(user);
    logger.info("User account created successfully, user ID: " + user.id);
    return "Account created successfully, please check your Gmail account to verify your email";
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
      logger.error("Invalid or expired token.");
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
      logger.error("Error while verifiying user's email");
      throw new APIError("Error while verifiying user's email", 500);
    }
    logger.info("Email verified successfully for user ID: " + user.id);
    return "Email verified, now you can login to your account.";
  }

  async sendEmailToken(Payload: any): Promise<any> {
    const user = await prisma.user.findUnique({
      where: {
        email: Payload,
      },
    });
    if (!user) {
      logger.error("Invalid email, cannot find user.");
      throw new APIError("Invalid email, cannot find user.", 404);
    }
    await createEmailVerifyToken(user);
    logger.info("Email sent successfully, user ID: " + user.id);
    return "Email sent successfully, please check your Gmail account to verify your email";
  }
}

export default new AuthService();
