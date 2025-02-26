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
    const query = new ApiFeatures(prisma, "category", Payload)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const categories = await query.execute();
    const response: IResponse = {
      statusCode: 200,
      status: "Success",
      data: { categories },
    };
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

export default new CategoryService();
