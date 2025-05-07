import { IResponse } from "../../Interfaces/types";

export interface IProgress {
  id: string;
  userId: string;
  courseId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  totalWatchedMinutes: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  course?: {
    name: string;
    thumbnail: string;
  };
}

export interface IVideoProgress {
  id: string;
  userId: string;
  videoId: string;
  watchedMinutes: number;
  lastWatchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProgressBody {
  userId: string;
  courseId: string;
}

export interface IGetProgressBody {
  userId: string;
  courseId: string;
}

export interface IUpdateProgressBody {
  userId: string;
  courseId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  totalWatchedMinutes: number;
}

export interface IDeleteProgressBody {
  userId: string;
  courseId: string;
}

export interface IProgressService {
  createProgress(Payload: ICreateProgressBody): Promise<IResponse>;
  getProgress(Payload: IGetProgressBody): Promise<IResponse>;
  updateProgress(Payload: IUpdateProgressBody): Promise<IResponse>;
  deleteProgress(Payload: IDeleteProgressBody): Promise<IResponse>;
  updateVideoProgress(
    userId: string,
    videoId: string,
    minutes: number
  ): Promise<IResponse>;
}

export interface updateVideoProgressBody {
  userId: string;
  videoId: string;
  minutes: number;
}
