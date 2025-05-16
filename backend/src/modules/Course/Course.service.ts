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
import { courseIncludeOptions, searchFilterOptions } from "../../utils/options";
import stringify from "fast-json-stable-stringify";
import redis from "../../config/redis";
import ResponseFormatter from "../../utils/responseFormatter";

interface ISearchPayload {
  q?: string;
  price?: number;
  purchased?: number;
  averageRatings?: number;
  [key: string]: any;
}

class CourseService {
  private readonly CACHE_TTL = {
    COURSE: 3600,
    COURSES: 3600,
    CATEGORY_COURSES: 86400,
    SEARCH: 1800,
  };

  private async validateCategories(categories: string[]): Promise<void> {
    for (const category of categories) {
      const exists = await prisma.category.findUnique({
        where: { name: category },
      });
      if (!exists) {
        ResponseFormatter.notFound(`Category with id: ${category} not found`);
      }
    }
  }

  private async createCategoryAssociations(
    courseId: string,
    categories: string[]
  ): Promise<void> {
    const categoryNames = categories;
    await Promise.all(
      categoryNames.map(async (name) => {
        if (name) {
          await prisma.categoryOnCourses.create({
            data: {
              courseId,
              categoryName: name,
            },
          });
        }
      })
    );
  }

  private async uploadThumbnail(thumbnail: string): Promise<string> {
    if (!thumbnail)
      ResponseFormatter.badRequest("Course should have a thumbnail");
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

  private async getCachedData<T>(key: string): Promise<T | null> {
    const cachedData = await redis.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  private async setCachedData<T>(
    key: string,
    data: T,
    ttl: number
  ): Promise<void> {
    await redis.setEx(key, ttl, JSON.stringify(data));
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
      ResponseFormatter.badRequest(
        "Error while creating a course, please try again"
      );
    }

    logger.info(`Teacher: ${publisherId} created a new course: ${course.id}`);
    await this.createCategoryAssociations(course.id, categories);
    await this.clearCourseCache();
    return ResponseFormatter.created({ course });
  }

  async getCourseById(Payload: IGetCoursesByIdBody): Promise<IResponse> {
    const { id, categoryId } = Payload;
    const cacheKey = `course:${id}${
      categoryId ? `:category:${categoryId}` : ""
    }`;

    const cachedData = await this.getCachedData<IResponse>(cacheKey);
    if (cachedData) {
      return ResponseFormatter.ok(
        cachedData.data,
        "Course retrieved from cache",
        { fromCache: true }
      );
    }

    let course: any;

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        ResponseFormatter.notFound("Invalid category ID: " + categoryId);
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
      ResponseFormatter.notFound(`Course id: ${id} did not match any course.`);
    }

    const categories = await prisma.categoryOnCourses.findMany({
      where: { courseId: id },
      select: { categoryName: true },
    });

    course.categories = categories;
    const response = ResponseFormatter.ok(categoryId ? course : { course });
    await this.setCachedData(cacheKey, response, this.CACHE_TTL.COURSE);
    return response;
  }

  async getCourses(Payload: IGetCoursesBody): Promise<IResponse> {
    const { query, categoryId } = Payload;
    const cacheKey = `courses:${stringify(
      categoryId ? `${categoryId}:${stringify(query)}` : query
    )}`;
    let size;
    const filterWith = {
      price: query.price ? Number(query.price) : undefined,
      purchased: query.purchased ? Number(query.purchased) : undefined,
      averageRatings: query.averageRatings
        ? Number(query.averageRatings)
        : undefined,
    };
    const cachedData = await this.getCachedData<IResponse>(cacheKey);
    if (cachedData) {
      return ResponseFormatter.ok(
        cachedData.data,
        "Courses retrieved from cache",
        { fromCache: true }
      );
    }

    let courses: any;
    let Options: any;
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        ResponseFormatter.notFound("Invalid category id: " + categoryId);
      }
      size = await prisma.categoryOnCourses.count({
        where: { categoryName: category.name },
      });
      Options = searchFilterOptions(filterWith, query);
      Options[0].categories = {
        some: {
          categoryName: category.name,
        },
      };
      Options[1].include = {
        categories: {
          select: {
            categoryName: true,
          },
        },
      };
    } else {
      size = await prisma.course.count();
      Options = searchFilterOptions(filterWith, query);
    }
    courses = await prisma.course.findMany({
      where: {
        ...Options[0],
      },
      ...Options[1],
    });
    for (const course of courses) {
      const categories = await prisma.categoryOnCourses.findMany({
        where: { courseId: course.id },
        select: { categoryName: true },
      });
      course.categories = categories;
    }
    const response = ResponseFormatter.ok(
      { courses, size: size },
      "Courses retrieved successfully",
      {
        fromCache: false,
        cacheTTL: categoryId
          ? this.CACHE_TTL.CATEGORY_COURSES
          : this.CACHE_TTL.COURSES,
      }
    );
    await this.setCachedData(
      cacheKey,
      response,
      categoryId ? this.CACHE_TTL.CATEGORY_COURSES : this.CACHE_TTL.COURSES
    );
    return response;
  }

  async search(Payload: ISearchPayload): Promise<IResponse> {
    const { q, price, purchased, averageRatings, ...rest } = Payload;
    const cacheKey = `courses:search:${stringify({
      q: q?.toLowerCase(),
      price,
      purchased,
      averageRatings,
      ...rest,
    })}`;

    const cachedData = await this.getCachedData<IResponse>(cacheKey);
    if (cachedData) {
      return ResponseFormatter.ok(
        cachedData.data,
        "Search results retrieved from cache",
        { fromCache: true }
      );
    }

    const filterWith = { price, purchased, averageRatings };
    const Options = searchFilterOptions(filterWith, Payload);

    const courses = await prisma.course.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q || "",
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: q || "",
              mode: "insensitive",
            },
          },
        ],
        ...Options[0],
      },
      ...Options[1],
    });

    const response = ResponseFormatter.ok({ courses });
    await this.setCachedData(cacheKey, response, this.CACHE_TTL.SEARCH);
    return response;
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
      ResponseFormatter.notFound(
        `Course id: ${courseId} did not match any course.`
      );
    }

    if (user?.role === "ADMIN" || course.publisherId === user?.id) {
      await prisma.course.delete({
        where: { id: courseId },
      });
      await this.clearCourseCache();
    } else {
      ResponseFormatter.unauthorized(
        "You are not authorized to delete this course"
      );
    }

    return ResponseFormatter.ok(
      { message: "Course deleted successfully" },
      "Course deleted successfully"
    );
  }

  async updateCourse(Payload: IUpdateCourseBody): Promise<IResponse> {
    const { id, publisherId, name, price, description, categories } = Payload;

    const course = await prisma.course.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!course) {
      ResponseFormatter.notFound(`Course id: ${id} did not match any course.`);
    }

    if (
      course.publisherId !== publisherId &&
      course.publisher?.role !== "ADMIN"
    ) {
      ResponseFormatter.unauthorized(
        "You are not authorized to update this course"
      );
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
    return ResponseFormatter.ok(
      { course: updatedCourse },
      "Course updated successfully"
    );
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
      ResponseFormatter.notFound(`Course id: ${id} did not match any course.`);
    }

    if (
      course.publisherId !== publisherId &&
      course.publisher?.role !== "ADMIN"
    ) {
      ResponseFormatter.unauthorized(
        "You are not authorized to update this course"
      );
    }

    const thumbnailUrl = await this.uploadThumbnail(thumbnail);

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { thumbnail: thumbnailUrl },
    });

    await this.clearCourseCache();
    return ResponseFormatter.ok(
      { course: updatedCourse },
      "Course thumbnail updated successfully"
    );
  }
}

export default new CourseService();
