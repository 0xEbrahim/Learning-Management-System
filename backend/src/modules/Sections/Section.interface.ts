import { CourseSections, Video } from "@prisma/client";

export interface ICreateSectionBody {
  name: string;
  courseId: string;
  userId: string;
}

export interface IGetSectionsBody {
  courseId: string;
}

export interface IGetSectionByIdBody {
  courseId: string;
  sectionId: string;
}

export interface IDeleteSectionBody {
  courseId: string;
  sectionId: string;
  userId: string;
}

export interface ISectionWithVideos extends CourseSections {
  Video: Video[];
}

export interface ISectionResponse {
  id: string;
  name: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  Video: Array<{
    id: string;
    title: string;
    videoUrl: string;
    videoThumbnail: string;
    videoLength: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
