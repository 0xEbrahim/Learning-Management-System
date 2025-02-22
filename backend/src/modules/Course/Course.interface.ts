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
}

export interface ICreateCourseBody {
  publisherId: string;
  name: string;
  price: string;
  description: string;
  thumbnail: string;
}
