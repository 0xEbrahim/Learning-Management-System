import stringify from "fast-json-stable-stringify";
import redis from "../../config/redis";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import ApiFeatures from "../../utils/APIFeatures";
import { ICreateCategoryBody, IGetCategoryBody } from "./Category.interface";

class CategoryService {
  async createCategory(Payload: ICreateCategoryBody): Promise<IResponse> {
    const { name } = Payload;
    const category = await prisma.category.create({
      data: {
        name: name,
      },
    });
    if (!category)
      throw new APIError(
        "Error while creating category, please try again",
        500
      );
    const response: IResponse = {
      status: "Success",
      statusCode: 201,
      data: {
        category,
      },
    };
    return response;
  }

  async getCategories(Payload: any): Promise<IResponse> {
    const cacheKey = `categories:${stringify(Payload)}`;
    const cachedData = await redis.get(cacheKey);
    let response: IResponse;
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const query = new ApiFeatures(prisma, "category", Payload)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const categories = await query.execute();
    response = {
      statusCode: 200,
      status: "Success",
      data: { categories },
    };
    await redis.setEx(cacheKey, 86400, JSON.stringify(response));
    return response;
  }

  async getCategoryById(Payload: IGetCategoryBody): Promise<IResponse> {
    const category = await prisma.category.findUnique({
      where: {
        id: Payload.id,
      },
      include: {
        courses: {
          select: {
            course: {
              select: {
                name: true,
                thumbnail: true,
                price: true,
                description: true,
              },
            },
          },
        },
      },
    });
    if (!category)
      throw new APIError("No category matched ID: " + Payload.id, 404);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        category,
      },
    };
    return response;
  }
}
// TODO: Add [Delet, Update] category

export default new CategoryService();
