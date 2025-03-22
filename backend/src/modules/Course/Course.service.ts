import fs from "fs";
import cloudinary from "../../config/cloudinary";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import {
  ICreateCourseBody,
  IDeleteCourseBody,
  IGetCoursesBody,
  IGetCoursesByIdBody,
  IUpdateCourseBody,
  IUpdateCourseThumbnailBody,
} from "./Course.interface";
import logger from "../../config/logger";
import ApiFeatures from "../../utils/APIFeatures";
import { courseIncludeOptions, searchFilterOptions } from "../../utils/options";
import stringify from "fast-json-stable-stringify";
import redis from "../../config/redis";

class CourseService {
  private async validateCategories(categories: string[]): Promise<void> {
    const existingCategories = await prisma.category.findMany({
      where: { name: { in: categories } },
      select: { name: true },
    });

    const existingCategoryNames = existingCategories.map((c) => c.name);
    const invalidCategories = categories.filter(
      (c) => !existingCategoryNames.includes(c)
    );

    if (invalidCategories.length > 0) {
      throw new APIError(
        `Invalid categories: ${invalidCategories.join(", ")}`,
        400
      );
    }
  }

  private async uploadThumbnail(thumbnail: string): Promise<string> {
    if (!thumbnail) throw new APIError("Course should have a thumbnail", 400);
    const uploaded = await cloudinary.uploader.upload(thumbnail, {
      folder: "Course",
    });
    fs.unlinkSync(thumbnail);
    return uploaded.secure_url;
  }

  private async clearCourseCache(): Promise<void> {
    const keys = await redis.keys(`courses:*`);
    if (keys.length > 0) await redis.del(keys);
  }

  private async createCategoryAssociations(
    courseId: string,
    categories: string[]
  ): Promise<void> {
    for (const categoryName of categories) {
      await prisma.categoryOnCourses.create({
        data: {
          courseId,
          categoryName,
        },
      });
    }
  }

  private formatResponse<T extends object | null>(
    data: T,
    statusCode: number = 200,
    message?: string
  ): IResponse {
    return {
      status: "Success",
      statusCode,
      message,
      data: data === null ? undefined : data,
    };
  }

  async createCourse(Payload: ICreateCourseBody): Promise<IResponse> {
    let { name, publisherId, thumbnail, price, description, categories } =
      Payload;
    if (typeof categories === "string") {
      categories = JSON.parse(categories);
    }
    categories = [...new Set(categories)];

    await this.validateCategories(categories);
    const thumbnailUrl = await this.uploadThumbnail(thumbnail);

    const course = await prisma.course.create({
      data: {
        name,
        publisherId,
        thumbnail: thumbnailUrl,
        description,
        price: Number(price),
      },
    });

    if (!course) {
      throw new APIError(
        "Error while creating a course, please try again",
        500
      );
    }

    logger.info(`Teacher: ${publisherId} created a new course: ${course.id}`);
    await this.createCategoryAssociations(course.id, categories);

    return this.formatResponse({ course }, 201);
  }

  async getCourseById(Payload: IGetCoursesByIdBody): Promise<IResponse> {
    const { id, categoryId } = Payload;
    let course: any;

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new APIError("Invalid category ID: " + categoryId, 404);
      }

      course = await prisma.categoryOnCourses.findFirst({
        where: {
          categoryName: category.name,
          courseId: id,
        },
        select: {
          courseId: false,
          categoryName: false,
          course: {
            include: courseIncludeOptions,
          },
        },
      });
    } else {
      course = await prisma.course.findUnique({
        where: { id },
        include: courseIncludeOptions,
      });
    }

    if (!course) {
      throw new APIError(`Course id: ${id} did not match any course.`, 404);
    }

    const categories = await prisma.categoryOnCourses.findMany({
      where: { courseId: id },
      select: { categoryName: true },
    });

    course.categories = categories;
    return this.formatResponse(categoryId ? course : { course });
  }

  async getCourses(Payload: IGetCoursesBody): Promise<IResponse> {
    const { query: q, categoryId } = Payload;
    const numberOfCourses = await prisma.course.count();
    const cacheKey = `courses:${stringify(categoryId || q)}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    let courses: any;
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new APIError("Invalid category id: " + categoryId, 404);
      }

      courses = await prisma.categoryOnCourses.findMany({
        where: { categoryName: category.name },
        select: {
          courseId: false,
          categoryName: false,
          course: {
            select: {
              name: true,
              thumbnail: true,
              price: true,
              description: true,
            },
          },
        },
      });
    } else {
      const query = new ApiFeatures(prisma, "course", q)
        .filter()
        .limitFields()
        .sort()
        .paginate();
      courses = await query.execute();

      for (const course of courses) {
        const categories = await prisma.categoryOnCourses.findMany({
          where: { courseId: course.id },
          select: { categoryName: true },
        });
        course.categories = categories;
      }
    }

    const response = this.formatResponse({ courses, size: numberOfCourses });
    await redis.setEx(
      cacheKey,
      categoryId ? 86400 : 3600,
      JSON.stringify(response)
    );
    return response;
  }

  async search(Payload: any): Promise<IResponse> {
    const { q, price, purchased, averageRatings, ...rest } = Payload;
    const cacheKey = `courses:search:${stringify({
      q: q?.toLowerCase(),
      price,
      purchased,
      averageRatings,
      ...rest,
    })}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return this.formatResponse({ courses: JSON.parse(cachedData) });
    }

    const filterWith = { price, purchased, averageRatings };
    const Options = searchFilterOptions(filterWith, Payload);

    const courses = await prisma.course.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
        ...Options[0],
      },
      ...Options[1],
    });

    return this.formatResponse({ courses });
  }

  async deleteCourse(Payload: IDeleteCourseBody): Promise<IResponse> {
    const { id, courseId } = Payload;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new APIError(
        `Course id: ${courseId} did not match any course.`,
        404
      );
    }

    if (user?.role === "ADMIN" || course.publisherId === user?.id) {
      await prisma.course.delete({
        where: { id: courseId },
      });
      await this.clearCourseCache();
    } else {
      throw new APIError("You are not authorized to delete this course", 401);
    }

    return this.formatResponse(null, 200, "Course deleted successfully");
  }

  async updateCourse(Payload: IUpdateCourseBody): Promise<IResponse> {
    const { id, publisherId, name, price, description, categories } = Payload;

    const course = await prisma.course.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!course) {
      throw new APIError(`Course id: ${id} did not match any course.`, 404);
    }

    if (
      course.publisherId !== publisherId &&
      course.publisher?.role !== "ADMIN"
    ) {
      throw new APIError("You are not authorized to update this course", 401);
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    if (categories) {
      await this.validateCategories(categories);
      await prisma.categoryOnCourses.deleteMany({
        where: { courseId: id },
      });
      await this.createCategoryAssociations(id, categories);
    }

    await this.clearCourseCache();
    return this.formatResponse({ course: updatedCourse });
  }

  async updateCourseThumbnail(
    Payload: IUpdateCourseThumbnailBody
  ): Promise<IResponse> {
    const { id, publisherId, thumbnail } = Payload;

    const course = await prisma.course.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!course) {
      throw new APIError(`Course id: ${id} did not match any course.`, 404);
    }

    if (
      course.publisherId !== publisherId &&
      course.publisher?.role !== "ADMIN"
    ) {
      throw new APIError("You are not authorized to update this course", 401);
    }

    const thumbnailUrl = await this.uploadThumbnail(thumbnail);

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { thumbnail: thumbnailUrl },
    });

    await this.clearCourseCache();
    return this.formatResponse({ course: updatedCourse });
  }
}

export default new CourseService();
