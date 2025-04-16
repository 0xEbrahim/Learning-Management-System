export interface ICreateReviewBody {
  rating: number;
  review: string;
  courseId: string;
  userId: string;
}


export interface IGetReviewByIdBody {
  courseId: string
  reviewId: string
}