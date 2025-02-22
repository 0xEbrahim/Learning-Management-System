import fs from "fs";
import cloudinary from "../../config/cloudinary";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { ICreateCourseBody } from "./Course.interface";
import logger from "../../config/logger";

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


}

export default new CourseService();
