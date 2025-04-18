import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import APIError from "../../utils/APIError";
import { CourseExists } from "../../utils/Functions/functions";
import { IReplyOnReviewBody } from "./Reply.interface";

class ReplyService {
  async replyOnReview(Payload: IReplyOnReviewBody): Promise<IResponse> {
    const { comment, reviewId, userId, courseId } = Payload;
    if (!(await CourseExists(courseId)))
      throw new APIError("Invalid course id", 404);
    const review = await prisma.review.findFirst({
      where: {
        courseId: courseId,
        id: reviewId,
      },
    });
    if (!review) throw new APIError("Invalid review id", 404);
    const reply = await prisma.reviewReply.create({
      data: {
        comment: comment,
        userId: userId,
        reviewId: reviewId,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 201,
      data: {
        reply,
      },
    };
    return response;
  }
}

export default new ReplyService();
