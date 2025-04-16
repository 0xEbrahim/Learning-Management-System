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

export interface IGetReviewsOnCourseBody {
  courseId : string,
  query: object
}