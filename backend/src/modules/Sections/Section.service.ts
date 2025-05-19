import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { CourseExists } from "../../utils/Functions/functions";
import redis from "../../config/redis";
import ResponseFormatter from "../../utils/responseFormatter";
import {
  ICreateSectionBody,
  IDeleteSectionBody,
  IGetSectionByIdBody,
  IGetSectionsBody,
} from "./Section.interface";

class SectionService {
  private readonly CACHE_TTL = 3600;
  private readonly SECTIONS_CACHE_KEY = (courseId: string) =>
    `sections:${courseId}`;
  private readonly SECTION_CACHE_KEY = (courseId: string, sectionId: string) =>
    `section:${courseId}:${sectionId}`;

  async createSection(Payload: ICreateSectionBody): Promise<IResponse> {
    const { courseId, name, userId } = Payload;

    if (!(await CourseExists(courseId))) {
      ResponseFormatter.notFound("Course not found");
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
      ResponseFormatter.conflict(
        "A section with this name already exists in the course"
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

    await redis.del(this.SECTIONS_CACHE_KEY(courseId));

    return ResponseFormatter.created(
      { section },
      "Section created successfully",
      {
        cacheInvalidated: true,
        videoCount: section.Video.length,
      }
    );
  }

  async getSections(Payload: IGetSectionsBody): Promise<IResponse> {
    const { courseId } = Payload;

    if (!(await CourseExists(courseId))) {
      ResponseFormatter.notFound("Course not found");
    }

    const cachedSections = await redis.get(this.SECTIONS_CACHE_KEY(courseId));
    if (cachedSections) {
      const sections = JSON.parse(cachedSections);
      return ResponseFormatter.ok(
        { sections },
        "Sections retrieved from cache",
        {
          fromCache: true,
          sectionCount: sections.length,
          totalVideos: sections.reduce(
            (acc: number, section: any) => acc + section.Video.length,
            0
          ),
        }
      );
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

    await redis.setEx(
      this.SECTIONS_CACHE_KEY(courseId),
      this.CACHE_TTL,
      JSON.stringify(sections)
    );

    return ResponseFormatter.ok(
      { sections },
      "Sections retrieved successfully",
      {
        fromCache: false,
        sectionCount: sections.length,
        totalVideos: sections.reduce(
          (acc, section) => acc + section.Video.length,
          0
        ),
        cacheTTL: this.CACHE_TTL,
      }
    );
  }

  async getSectionById(Payload: IGetSectionByIdBody): Promise<IResponse> {
    const { courseId, sectionId } = Payload;

    if (!(await CourseExists(courseId))) {
      ResponseFormatter.notFound("Course not found");
    }

    const cachedSection = await redis.get(
      this.SECTION_CACHE_KEY(courseId, sectionId)
    );
    if (cachedSection) {
      const section = JSON.parse(cachedSection);
      return ResponseFormatter.ok({ section }, "Section retrieved from cache", {
        fromCache: true,
        videoCount: section.Video.length,
      });
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
      ResponseFormatter.notFound("Section not found");
    }

    await redis.setEx(
      this.SECTION_CACHE_KEY(courseId, sectionId),
      this.CACHE_TTL,
      JSON.stringify(section)
    );

    return ResponseFormatter.ok({ section }, "Section retrieved successfully", {
      fromCache: false,
      videoCount: section.Video.length,
      cacheTTL: this.CACHE_TTL,
    });
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
        ResponseFormatter.notFound("Section not found");
      }

      const videoCount = section.Video.length;

      if (videoCount > 0) {
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

      await redis.del(this.SECTION_CACHE_KEY(courseId, sectionId));
      await redis.del(this.SECTIONS_CACHE_KEY(courseId));

      return ResponseFormatter.ok(
        { deletedVideos: videoCount },
        "Section and its videos deleted successfully",
        {
          cacheInvalidated: true,
        }
      );
    });
  }
}

export default new SectionService();
