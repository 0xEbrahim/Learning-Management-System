export interface uploadVideoBody {
  title: string;
  video: string;
  videoThumbnail: string;
  videoLength: number;
  courseId: string;
}

export interface VideoByIdBody {
  courseId: string;
  videoId: string;
}

export interface updateVideoBody {
  title: string;
  videoId: string;
  courseId: string;
}

export interface editVideo {
  videoId: string;
  courseId: string;
  video: string;
  videoLength: number;
}

export interface editThumbnailBody {
  videoId: string;
  courseId: string;
  thumbnail: string;
}
