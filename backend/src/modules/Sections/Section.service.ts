import { response } from "express";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { CourseExists, isCourseAuthor } from "../../utils/Functions/functions";
import {
  ICreateSectionBody,
  IDeleteSectionBody,
  IGetSectionByIdBody,
  IGetSectionsBody,
} from "./Section.interface";

class SectionService {
  async createSection(Payload: ICreateSectionBody): Promise<IResponse> {
    const { courseId, name, userId } = Payload;
    const check = await isCourseAuthor(courseId, userId);
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

  async getSections(Payload: IGetSectionsBody): Promise<IResponse> {
    const { courseId } = Payload;
    if (!(await CourseExists(courseId)))
      throw new APIError("Invalid course ID", 404);
    const sections = await prisma.courseSections.findMany({
      where: {
        courseId: courseId,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        sections,
      },
    };
    return response;
  }

  async getSectionById(Payload: IGetSectionByIdBody): Promise<IResponse> {
    const { courseId, sectionId } = Payload;
    if (!(await CourseExists(courseId)))
      throw new APIError("Invalid Course ID", 404);
    const section = await prisma.courseSections.findFirst({
      where: {
        courseId: courseId,
        id: sectionId,
      },
      include: {
        Video: true,
      },
    });
    if (!section) throw new APIError("Invalid section ID", 404);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        section,
      },
    };
    return response;
  }

  async deleteSection(Payload: IDeleteSectionBody): Promise<IResponse> {
    const { courseId, sectionId, userId } = Payload;
    const check = await isCourseAuthor(courseId, userId);
    if (!check)
      throw new APIError("You are not authorized on this course", 401);
    const section = await prisma.courseSections.findFirst({
      where: {
        courseId: courseId,
        id: sectionId,
      },
      include: {
        Video: true,
      },
    });
    if (!section) throw new APIError("Invalid section ID", 404);
    await prisma.courseSections.delete({
      where: {
        id: sectionId,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      message: "Section and its videos deleted successfully",
    };
    return response;
  }
}

export default new SectionService();
