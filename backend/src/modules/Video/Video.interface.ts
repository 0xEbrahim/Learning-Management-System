export interface uploadVideoBody {
  title: string;
  video: string;
  videoThumbnail: string;
  videoLength: number;
  courseId: string;
}

export interface getVideoByIdBody {
  courseId: string;
  videoId: string;
}
