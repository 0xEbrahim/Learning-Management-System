import fs from "fs";
import cloudinary from "../../config/cloudinary";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { ICreateCourseBody, IDeleteCourseBody } from "./Course.interface";
import logger from "../../config/logger";
import ApiFeatures from "../../utils/APIFeatures";

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

  async getCourseById(Payload: string): Promise<IResponse> {
    const course = await prisma.course.findUnique({
      where: {
        id: Payload,
      },
      include: {
        publisher: {
          select: {
            name: true,
            avatar: true,
          },
        },
        prerequisites: {
          select: {
            title: true,
          },
        },
        demo: {
          select: {
            url: true,
          },
        },
        courseData: {
          select: {
            title: true,
            videoUrl: true,
            videoLength: true,
            videoThumbnail: true,
          },
        },
        reviews: {
          select: {
            author: {
              select: {
                name: true,
                avatar: true,
              },
            },
            review: true,
            rating: true,
            Replies: true,
          },
        },
      },
    });
    if (!course)
      throw new APIError(
        `course id: ${Payload} did not match any course.`,
        404
      );
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        course,
      },
    };
    return response;
  }

  async getCourses(Payload: any): Promise<IResponse> {
    const query = new ApiFeatures(prisma, "course", Payload)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const courses = await query.execute();
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: { courses },
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
