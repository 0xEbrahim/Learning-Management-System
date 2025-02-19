import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { cleanUsersData } from "../../utils/Functions/functions";
import { IUser } from "./User.interface";
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

  async getUsers(Payload: any) {
    const query = new ApiFeatures(prisma, "user", Payload);
    const users = await query.execute();
    for (let i = 0; i < users.length; i++) cleanUsersData(users[i] as IUser);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: { users },
    };
    return response;
  }
}

export default new UserService();
