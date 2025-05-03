import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { isCourseAuthor } from "../../utils/Functions/functions";
import { ICreateSectionBody } from "./Section.interface";

class SectionService {
  async createSection(Payload: ICreateSectionBody): Promise<IResponse> {
    const { courseId, name, userId } = Payload;
    const check = isCourseAuthor(courseId, userId);
    if (!check)
      throw new APIError("You are not authorized on this course", 401);
    const section = await prisma.courseSections.create({
      data: {
        courseId: courseId,
        name: name,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 201,
      data: {
        section,
      },
    };
    return response;
  }
}

export default new SectionService();
