export interface IUploadDemoBody {
  video: string;
  courseId: string;
}

export interface IGetDemoBody {
  courseId: string;
}

export interface IDeleteDemoBody {
  courseId: string;
}
