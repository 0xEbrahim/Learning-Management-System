export interface IGetDemoBody {
  courseId: string;
}
export interface IUploadDemoBody extends IGetDemoBody {
  video: string;
}

export interface IDeleteDemoBody extends IGetDemoBody {}

export interface IUpdateDemoBody extends IUploadDemoBody {}
