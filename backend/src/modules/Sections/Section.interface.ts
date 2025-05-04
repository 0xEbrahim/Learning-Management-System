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
