import { CourseSections, Video } from "@prisma/client";

export interface ICreateSectionBody {
  name: string;
  courseId: string;
  userId: string;
}

export interface IGetSectionsBody
  extends Pick<ICreateSectionBody, "courseId"> {}

export interface IGetSectionByIdBody
  extends Pick<ICreateSectionBody, "courseId"> {
  sectionId: string;
}

export interface IDeleteSectionBody
  extends Pick<ICreateSectionBody, "courseId" | "userId"> {
  sectionId: string;
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
