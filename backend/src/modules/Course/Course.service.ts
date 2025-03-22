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
} from "./Course.interface";
import logger from "../../config/logger";
import ApiFeatures from "../../utils/APIFeatures";
import { courseIncludeOptions, searchFilterOptions } from "../../utils/options";
import stringify from "fast-json-stable-stringify";
import redis from "../../config/redis";

class CourseService {
  async createCourse(Payload: ICreateCourseBody): Promise<IResponse> {
    let { name, publisherId, thumbnail, price, description, categories } =
      Payload;
    if (typeof categories === "string") {
      categories = JSON.parse(categories);
    }
    categories = [...new Set(categories)];

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
    if (!thumbnail) throw new APIError("Course should have a thumbnail", 400);
    const uploaded = await cloudinary.uploader.upload(thumbnail, {
      folder: "Course",
    });
    fs.unlinkSync(thumbnail);
    const course = await prisma.course.create({
      data: {
        name: name,
        publisherId: publisherId,
        thumbnail: uploaded.secure_url,
        description: description,
        price: Number(price),
      },
    });
    if (!course)
      throw new APIError(
        "Error while creating a course, please try again",
        500
      );
    logger.info(
      "Teacher: " + publisherId + " created a new course : " + course.id
    );
    categories.forEach(async (el) => {
      await prisma.categoryOnCourses.create({
        data: {
          courseId: course.id,
          categoryName: el,
        },
      });
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 201,
      data: {
        course,
      },
    };
    return response;
  }

  async getCourseById(Payload: IGetCoursesByIdBody): Promise<IResponse> {
    let course: any,
      check = false;
    const { id, categoryId } = Payload;
    if (categoryId) {
      check = true;
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      if (!category)
        throw new APIError("Invalid category ID: " + categoryId, 404);
      course = await prisma.categoryOnCourses.findFirst({
        where: {
          categoryName: category.name,
          courseId: id,
        },
        select: {
          courseId: false,
          categoryName: false,
          course: {
            include: {
              ...courseIncludeOptions,
            },
          },
        },
      });
    } else {
      course = await prisma.course.findUnique({
        where: {
          id: id,
        },
        include: {
          ...courseIncludeOptions,
        },
      });
    }
    if (!course)
      throw new APIError(`course id: ${id} did not match any course.`, 404);
    const categories = await prisma.categoryOnCourses.findMany({
      where: {
        courseId: id,
      },
      select: {
        categoryName: true,
      },
    });
    course.categories = categories;
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: check
        ? course
        : {
            course,
          },
    };
    return response;
  }

  async getCourses(Payload: IGetCoursesBody): Promise<IResponse> {
    const { query: q, categoryId } = Payload;
    const numberOfCourses = await prisma.course.count();
    let courses: any,
      check = false,
      cacheKey: string,
      response: IResponse;
    if (categoryId) {
      cacheKey = `courses:${stringify(categoryId)}`;
    } else {
      cacheKey = `courses:${stringify(q)}`;
    }

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    if (categoryId) {
      check = true;
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      if (!category)
        throw new APIError("Invalid category id: " + categoryId, 404);
      courses = await prisma.categoryOnCourses.findMany({
        where: {
          categoryName: category.name,
        },
        select: {
          courseId: false,
          categoryName: false,
          course: {
            select: {
              id: true,
              publisherId: true,
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
      for (let i = 0; i < courses.length; i++) {
        const categories = await prisma.categoryOnCourses.findMany({
          where: {
            courseId: courses[i].id,
          },
          select: {
            categoryName: true,
          },
        });
        courses[i].categories = categories;
      }
    }
    const ttl = categoryId ? 86400 : 3600;
    response = {
      status: "Success",
      size: numberOfCourses,
      statusCode: 200,
      data: check ? courses : { courses },
    };
    await redis.setEx(cacheKey, ttl, JSON.stringify(response));
    return response;
  }

  async search(Payload: any): Promise<IResponse> {
    let { q, price, purchased, averageRatings, ...rest } = Payload;
    const cacheKey = `courses:search:${stringify({
      q: q?.toLowerCase(),
      price,
      purchased,
      averageRatings,
      ...rest,
    })}`;
    let response: IResponse;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      response = {
        status: "Success",
        statusCode: 200,
        data: {
          courses: JSON.parse(cachedData),
        },
      };
      return response;
    }

    const filterWith: any = { price, purchased, averageRatings };
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
    response = {
      status: "Success",
      statusCode: 200,
      data: {
        courses,
      },
    };
    return response;
  }

  async deleteCourse(Payload: IDeleteCourseBody): Promise<IResponse> {
    const { id, courseId } = Payload;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course)
      throw new APIError(
        "courseId: " + courseId + " did not match any course.",
        404
      );
    if (user?.role === "ADMIN" || course.publisherId === user?.id) {
      await prisma.course.delete({
        where: {
          id: courseId,
        },
      });
      const keys = await redis.keys(`courses:*`);
      if (keys.length > 0) await redis.del(keys);
    } else {
      throw new APIError("You are not authorized to delete this course", 401);
    }
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      message: "Course deleted successfully",
    };
    return response;
  }
}

// TODO: Update course data

export default new CourseService();
