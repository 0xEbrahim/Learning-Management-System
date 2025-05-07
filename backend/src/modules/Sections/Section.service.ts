import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { CourseExists } from "../../utils/Functions/functions";
import {
  ICreateSectionBody,
  IDeleteSectionBody,
  IGetSectionByIdBody,
  IGetSectionsBody,
} from "./Section.interface";

class SectionService {
  async createSection(Payload: ICreateSectionBody): Promise<IResponse> {
    const { courseId, name, userId } = Payload;

    if (!(await CourseExists(courseId))) {
      throw new APIError("Course not found", 404);
    }

    const existingSection = await prisma.courseSections.findFirst({
      where: {
        courseId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingSection) {
      throw new APIError(
        "A section with this name already exists in the course",
        409
      );
    }

    const section = await prisma.courseSections.create({
      data: {
        courseId,
        name,
      },
      include: {
        Video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            videoThumbnail: true,
            videoLength: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return {
      status: "Success",
      statusCode: 201,
      data: { section },
    };
  }

  async getSections(Payload: IGetSectionsBody): Promise<IResponse> {
    const { courseId } = Payload;

    if (!(await CourseExists(courseId))) {
      throw new APIError("Course not found", 404);
    }

    const sections = await prisma.courseSections.findMany({
      where: { courseId },
      include: {
        Video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            videoThumbnail: true,
            videoLength: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      status: "Success",
      statusCode: 200,
      data: { sections },
    };
  }

  async getSectionById(Payload: IGetSectionByIdBody): Promise<IResponse> {
    const { courseId, sectionId } = Payload;

    if (!(await CourseExists(courseId))) {
      throw new APIError("Course not found", 404);
    }

    const section = await prisma.courseSections.findFirst({
      where: {
        courseId,
        id: sectionId,
      },
      include: {
        Video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            videoThumbnail: true,
            videoLength: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!section) {
      throw new APIError("Section not found", 404);
    }

    return {
      status: "Success",
      statusCode: 200,
      data: { section },
    };
  }

  async deleteSection(Payload: IDeleteSectionBody): Promise<IResponse> {
    const { courseId, sectionId, userId } = Payload;

    return await prisma.$transaction(async (tx) => {
      const section = await tx.courseSections.findFirst({
        where: {
          courseId,
          id: sectionId,
        },
        include: {
          Video: true,
        },
      });

      if (!section) {
        throw new APIError("Section not found", 404);
      }

      if (section.Video.length > 0) {
        await tx.video.deleteMany({
          where: {
            sectionId: sectionId,
          },
        });
      }

      await tx.courseSections.delete({
        where: {
          id: sectionId,
        },
      });

      return {
        status: "Success",
        statusCode: 200,
        message: "Section and its videos deleted successfully",
      };
    });
  }
}

export default new SectionService();
