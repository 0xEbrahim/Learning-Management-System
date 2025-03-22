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
  url: string;
  publisher?: { name: string; avatar?: string | null };
}

export interface IGetCoursesByIdBody {
  id: string;
  categoryId?: string;
}

export interface IGetCoursesBody {
  query: Record<string, any>;
  categoryId?: string;
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

export interface IUpdateCourseBody {
  id: string;
  publisherId: string;
  name?: string;
  price?: string;
  description?: string;
  categories?: string[];
}

export interface IUpdateCourseThumbnailBody {
  id: string;
  publisherId: string;
  thumbnail: string;
}
