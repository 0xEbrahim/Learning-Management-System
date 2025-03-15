import cron from "node-cron";
import stringify from "fast-json-stable-stringify";
import fs from "fs";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { cleanUsersData } from "../../utils/Functions/functions";
import {
  IUpdateProfilePicBody,
  IUpdateUserBody,
  IUser,
} from "./User.interface";
import config from "../../config/env";
import ApiFeatures from "../../utils/APIFeatures";
import prisma from "../../config/prisma";
import cloudinary from "../../config/cloudinary";
import logger from "../../config/logger";
import redis from "../../config/redis";
class UserService {
  async getUserById(Payload: string): Promise<IResponse> {
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
    };
    const user: IUser | null = await prisma.user.findUnique({
      where: {
        id: Payload,
      },
      include: {
        courses: {
          select: {
            id: true,
          },
        },
        publishedCourses: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!user) throw new APIError("Invalid user id", 404);
    cleanUsersData(user);
    response.data = { user };
    return response;
  }

  async getUsers(Payload: any): Promise<IResponse> {
    const cacheKey = `users:${stringify(Payload)}`;
    const cachedData = await redis.get(cacheKey);
    let response: IResponse;
    if (cachedData) {
      response = {
        status: "Success",
        statusCode: 200,
        data: { users: JSON.parse(cachedData) },
      };
      return response;
    }
    const query = new ApiFeatures(prisma, "user", Payload)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const users = await query.execute();
    for (let i = 0; i < users.length; i++) cleanUsersData(users[i] as IUser);
    await redis.setEx(cacheKey, 86400, JSON.stringify(users));
    response = {
      status: "Success",
      statusCode: 200,
      data: { users },
    };
    return response;
  }

  async search(Payload: any): Promise<IResponse> {
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
    };
    let { page, sort, limit, fields, q } = Payload;
    const excFields = ["page", "sort", "limit", "fields", "q"];
    excFields.forEach((el) => delete Payload[el]);
    const cacheKeyObject = {
      q: q?.toLowerCase(),
      page: page || 1,
      limit: limit || 100,
      sort,
      fields,
      filters: Payload,
    };
    const cacheKey = `users:${stringify(cacheKeyObject)}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      response.data = { users: JSON.parse(cachedData) };
      return response;
    }
    page = page || 1;
    limit = limit || 100;
    const skip = (page - 1) * limit;
    fields = fields
      ? fields.split(",").reduce((acc: any, field: string) => {
          acc[field] = true;
          return acc;
        }, {})
      : {};
    if (sort) sort = sort.split(",");
    const orderBy: Record<string, any> = {};
    if (sort)
      for (let i = 0; i < sort.length; i++) {
        const key = sort[i].replace("-", "");
        const value = sort[i].startsWith("-") ? "desc" : "asc";
        orderBy[key] = value;
      }
    const options: Record<string, any> = { skip: skip, take: +limit };
    if (JSON.stringify(fields) !== "{}") {
      options.select = fields;
    }
    if (JSON.stringify(orderBy) !== "{}") {
      options.orderBy = orderBy;
    }
    const users: IUser[] = await prisma.user.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
        ...Payload,
      },
      ...options,
    });
    for (let i = 0; i < users.length; i++) cleanUsersData(users[i], "email");
    redis.setEx(cacheKey, 86400, JSON.stringify(users));
    response.data = { users };
    return response;
  }
  async updateUser(Payload: IUpdateUserBody): Promise<IResponse> {
    const user = await prisma.user.update({
      where: {
        id: Payload.id,
      },
      data: {
        name: Payload.name,
      },
    });
    const keys = await redis.keys(`users:*`);
    if (keys.length > 0) redis.del(keys);
    if (!user) throw new APIError("Error while updating user", 500);
    cleanUsersData(user);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        user,
      },
    };
    return response;
  }

  async updateProfilePic(Payload: IUpdateProfilePicBody): Promise<IResponse> {
    const { avatar, id, remove } = Payload;
    let user;
    if (remove === true) {
      user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          avatar: config.DEFAULT_PROF_PIC,
        },
      });
    } else {
      let uploaded;
      if (avatar) {
        uploaded = await cloudinary.uploader.upload(avatar, {
          folder: "Users",
        });
        fs.unlinkSync(avatar);
      } else {
        throw new APIError("Failed, please provide profile picture", 400);
      }
      user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          avatar: uploaded.secure_url,
        },
      });
    }
    const keys = await redis.keys(`users:*`);
    if (keys.length > 0) redis.del(keys);
    cleanUsersData(user);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      message: "Profile picture updated successfully.",
      data: {
        user,
      },
    };
    return response;
  }

  async deactivateAccount(Payload: string): Promise<IResponse> {
    const id = Payload;
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
        deleteAt: new Date(Date.now() + 60 * 1000),
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      message:
        "Account deactivated successfully and will be deleted permanently after 30 days",
    };
    return response;
  }
}

cron.schedule("0 0 * * *", async () => {
  try {
    await prisma.user.deleteMany({
      where: {
        deleteAt: {
          lt: new Date(Date.now()),
        },
      },
    });
    logger.info("Deleting users cron job worked");
  } catch (err: any) {
    throw new APIError(err.message, 400);
  }
});

export default new UserService();
