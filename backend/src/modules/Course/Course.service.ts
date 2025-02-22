import fs from "fs";
import cloudinary from "../../config/cloudinary";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { ICourse, ICreateCourseBody } from "./Course.interface";
import logger from "../../config/logger";
import ApiFeatures from "../../utils/APIFeatures";

class CourseService {
  async createCourse(Payload: ICreateCourseBody): Promise<IResponse> {
    const { name, publisherId, thumbnail, price, description } = Payload;
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

  async getCourses(Payload: any): Promise<any> {
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
}

export default new CourseService();
