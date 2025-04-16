import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { updateCourseRating } from "../../utils/Functions/functions";
import { searchFilterOptions } from "../../utils/options";
import {
  ICreateReviewBody,
  IGetReviewByIdBody,
  IGetReviewsOnCourseBody,
} from "./Review.interface";

class ReviewService {
  async createReview(Payload: ICreateReviewBody): Promise<IResponse> {
    const { courseId, rating, review: rev, userId } = Payload;
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) throw new APIError("Course id did not match any course", 404);
    const review = await prisma.review.create({
      data: {
        userId: userId,
        courseId: courseId,
        rating: rating,
        review: rev,
      },
    });
    if (!review) throw new APIError("Error while creating the review", 500);
    const response: IResponse = {
      status: "Success",
      statusCode: 201,
      data: {
        review,
      },
    };
    try {
      await updateCourseRating(courseId);
    } catch (error: any) {
      throw new APIError(error.message, 400);
    }
    return response;
  }

  async getReviewById(Payload: IGetReviewByIdBody): Promise<IResponse> {
    const { courseId, reviewId } = Payload;
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) throw new APIError("Invalid course id", 404);
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        courseId: courseId,
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });
    if (!review) throw new APIError("Invalid review Id", 404);
    const resposnse: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        review,
      },
    };
    return resposnse;
  }
  async getReviewsOnCourse(
    Payload: IGetReviewsOnCourseBody
  ): Promise<IResponse> {
    const { courseId, query } = Payload;
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) throw new APIError("Invalid course ID", 404);
    const options = searchFilterOptions({}, query);
    const reviews = await prisma.review.findMany({
      where: {
        courseId: courseId,
        ...options[0],
      },
      ...options[1],
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        reviews,
      },
    };
    return response;
  }
}

export default new ReviewService();
