import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import ResponseFormatter from "../../utils/responseFormatter";
import redis from "../../config/redis";
import {
  CourseExists,
  updateCourseRating,
} from "../../utils/Functions/functions";
import { searchFilterOptions } from "../../utils/options";
import {
  ICreateReviewBody,
  IDeleteReviewBody,
  IGetReviewByIdBody,
  IGetReviewsOnCourseBody,
  IUpdateReviewBody,
} from "./Review.interface";

class ReviewService {
  private readonly CACHE_TTL = 3600;

  private REVIEW_CACHE_KEY(reviewId: string, courseId: string): string {
    return `review:${courseId}:${reviewId}`;
  }

  private REVIEWS_COURSE_CACHE_KEY(courseId: string): string {
    return `reviews:course:${courseId}`;
  }

  async createReview(Payload: ICreateReviewBody): Promise<IResponse> {
    const { courseId, rating, review: rev, userId } = Payload;
    if (!(await CourseExists(courseId)))
      throw new APIError("Course id did not match any course", 404);
    const review = await prisma.review.create({
      data: {
        userId: userId,
        courseId: courseId,
        rating: rating,
        review: rev,
      },
    });
    if (!review) throw new APIError("Error while creating the review", 500);
    try {
      await updateCourseRating(courseId);
      await redis.del(this.REVIEWS_COURSE_CACHE_KEY(courseId));
    } catch (error: any) {
      throw new APIError(error.message, 400);
    }
    return ResponseFormatter.created({ review });
  }

  async getReviewById(Payload: IGetReviewByIdBody): Promise<IResponse> {
    const { courseId, reviewId } = Payload;
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) throw new APIError("Invalid course id", 404);

    const cachedReview = await redis.get(
      this.REVIEW_CACHE_KEY(reviewId, courseId)
    );
    if (cachedReview) {
      return ResponseFormatter.ok(
        { review: JSON.parse(cachedReview) },
        "Review retrieved from cache",
        { fromCache: true }
      );
    }

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

    await redis.setEx(
      this.REVIEW_CACHE_KEY(reviewId, courseId),
      this.CACHE_TTL,
      JSON.stringify(review)
    );

    return ResponseFormatter.ok({ review }, "Review retrieved successfully", {
      fromCache: false,
      cacheTTL: this.CACHE_TTL,
    });
  }

  async getReviewsOnCourse(
    Payload: IGetReviewsOnCourseBody
  ): Promise<IResponse> {
    const { courseId, query } = Payload;
    if (!(await CourseExists(courseId)))
      throw new APIError("Course id did not match any course", 404);

    const cachedReviews = await redis.get(
      this.REVIEWS_COURSE_CACHE_KEY(courseId)
    );
    if (cachedReviews) {
      return ResponseFormatter.ok(
        { reviews: JSON.parse(cachedReviews) },
        "Reviews retrieved from cache",
        { fromCache: true }
      );
    }

    const options = searchFilterOptions({}, query);
    const reviews = await prisma.review.findMany({
      where: {
        courseId: courseId,
        ...options[0],
      },
      ...options[1],
    });

    await redis.setEx(
      this.REVIEWS_COURSE_CACHE_KEY(courseId),
      this.CACHE_TTL,
      JSON.stringify(reviews)
    );

    return ResponseFormatter.ok({ reviews }, "Reviews retrieved successfully", {
      fromCache: false,
      cacheTTL: this.CACHE_TTL,
    });
  }

  async updateReview(Payload: IUpdateReviewBody): Promise<IResponse> {
    const { courseId, rating, review: rev, reviewId, userId } = Payload;
    if (!(await CourseExists(courseId)))
      throw new APIError("Course id did not match any course", 404);
    let review = await prisma.review.findFirst({
      where: {
        courseId: courseId,
        id: reviewId,
        userId: userId,
      },
    });
    if (!review) throw new APIError("Invalid review id", 404);
    review = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        review: rev,
        rating: rating,
      },
    });
    try {
      await updateCourseRating(courseId);
      await redis.del(this.REVIEW_CACHE_KEY(reviewId, courseId));
      await redis.del(this.REVIEWS_COURSE_CACHE_KEY(courseId));
    } catch (error: any) {
      throw new APIError(error.message, 400);
    }
    return ResponseFormatter.ok({ review });
  }

  async deleteReview(Payload: IDeleteReviewBody): Promise<IResponse> {
    const { courseId, reviewId, userId } = Payload;
    if (!(await CourseExists(courseId)))
      throw new APIError("Course id did not match any course", 404);
    const review = await prisma.review.findFirst({
      where: {
        userId: userId,
        id: reviewId,
        courseId: courseId,
      },
    });
    if (!review) throw new APIError("Invalid review id", 404);
    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
    try {
      await updateCourseRating(courseId);
      await redis.del(this.REVIEW_CACHE_KEY(reviewId, courseId));
      await redis.del(this.REVIEWS_COURSE_CACHE_KEY(courseId));
    } catch (error: any) {
      throw new APIError(error.message, 400);
    }
    return ResponseFormatter.ok(undefined, "Review deleted successfully");
  }
}

export default new ReviewService();
