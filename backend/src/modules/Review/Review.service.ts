import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { ICreateReviewBody } from "./Review.interface";

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
    return response;
  }
}

export default new ReviewService();
