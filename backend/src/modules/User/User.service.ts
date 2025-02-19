import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { cleanUsersData } from "../../utils/Functions/functions";
import { IUser } from "./User.interface";

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
}

export default new UserService();
