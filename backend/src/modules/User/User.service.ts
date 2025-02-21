import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { cleanUsersData } from "../../utils/Functions/functions";
import { IUpdateUserBody, IUser } from "./User.interface";
import ApiFeatures from "../../utils/APIFeatures";
import prisma from "../../config/prisma";

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
    });
    if (!user) throw new APIError("Invalid user id", 404);
    cleanUsersData(user);
    response.data = { user };
    return response;
  }

  async getUsers(Payload: any): Promise<IResponse> {
    const query = new ApiFeatures(prisma, "user", Payload)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const users = await query.execute();
    for (let i = 0; i < users.length; i++) cleanUsersData(users[i] as IUser);
    const response: IResponse = {
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
    for (let i = 0; i < users.length; i++) cleanUsersData(users[i]);
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
}

export default new UserService();
