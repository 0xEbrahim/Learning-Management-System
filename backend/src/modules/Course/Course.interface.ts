export interface ICourse {
  id: string;
  publisherId: string;
  name: string;
  price: number;
  description: string;
  averageRatings: number;
  thumbnail: string;
  purchased: number;
  createdAt: Date;
  updatedAt: Date;
  demoUrl: string;
  publisher?: { name: string; avatar?: string | null };
}

export interface ICreateCourseBody {
  publisherId: string;
  name: string;
  price: string;
  description: string;
  thumbnail: string;
  categories: string[];
}

export interface IDeleteCourseBody {
  id: string;
  courseId: string;
}
