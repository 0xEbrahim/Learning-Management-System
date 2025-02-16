import prisma from "../../config/prisma";
import { IRegisterBody } from "./Auth.Interface";
import cloudinary from "../../config/cloudinary";
import logger from "../../config/logger";
import APIError from "../../utils/APIError";
class AuthService {
  async register(Payload: IRegisterBody): Promise<any> {
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
    }
    const user = await prisma.user.create({
      data: {
        name: Payload.name,
        email: Payload.email,
        password: Payload.password,
        avatar: avatar?.secure_url,
      },
    });
    if (!user) {
      logger.error("Error while creating a new user");
      throw new APIError("Error while creating account, please try again", 500);
    }
  }
  
}

export default new AuthService();
