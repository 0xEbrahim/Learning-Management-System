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
import { courseIncludeOptions } from "../../utils/options";

class CourseService {
  async createCourse(Payload: ICreateCourseBody): Promise<IResponse> {
    const { name, publisherId, thumbnail, price, description, categories } =
      Payload;
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
    let course,
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
      throw new APIError(
        `course id: ${Payload} did not match any course.`,
        404
      );
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
    let courses,
      check = false;
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
    }
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: check ? courses : { courses },
    };
    return response;
  }

  async search(Payload: any): Promise<IResponse> {
    let { sort, page, limit, fields, q, price, purchased, averageRatings } =
      Payload;
    const filterWith: any = { price, purchased, averageRatings };
    const exc = ["sort", "page", "fields", "q", "limit"];
    exc.forEach((el) => delete Payload[el]);
    page = page || 1;
    limit = limit || 10;
    const skip = (page - 1) * limit;
    const options: Record<string, any> = {};
    const orderBy: Record<string, any> = {};
    const selected: Record<string, any> = {};
    Object.keys(filterWith).forEach((key) => {
      if (typeof filterWith[key] === "object") {
        Object.keys(filterWith[key]).forEach((op) => {
          const prismaOp =
            op === "gte" || op === "gt" || op === "lte" || op === "lt"
              ? op
              : null;
          if (prismaOp) filterWith[key][prismaOp] = Number(filterWith[key][op]);
        });
      } else {
        delete filterWith[key];
      }
    });
    options.skip = skip;
    options.take = +limit;
    if (fields) {
      fields.split(",").forEach((el: any) => (selected[el] = true));
      options.select = selected;
    }
    if (sort) {
      sort = sort.split(",");
      for (let i = 0; i < sort.length; i++) {
        const key = sort[i].replace("-", "");
        const value = sort[i].startsWith("-") ? "desc" : "asc";
        orderBy[key] = value;
      }
      options.orderBy = orderBy;
    }
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
        ...filterWith,
      },
      ...options,
    });
    const response: IResponse = {
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

export default new CourseService();
