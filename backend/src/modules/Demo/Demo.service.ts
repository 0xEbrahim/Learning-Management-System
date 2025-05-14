import fs from "fs";
import {
  IDeleteDemoBody,
  IGetDemoBody,
  IUpdateDemoBody,
  IUploadDemoBody,
} from "./Demo.interface";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import {
  CourseExists,
  uploadLargeVideo,
} from "../../utils/Functions/functions";
import APIError from "../../utils/APIError";

class DemoService {
  async uploadDemo(Payload: IUploadDemoBody): Promise<IResponse> {
    const { courseId, video } = Payload;
    let demo = await prisma.$transaction(
      async (tx) => {
        let demo = await tx.demo.findUnique({
          where: {
            courseId: courseId,
          },
        });
        if (demo) {
          await tx.demo.deleteMany({
            where: {
              courseId: courseId,
            },
          });
        }
        let videoUpload = await uploadLargeVideo(video);
        videoUpload = videoUpload.secure_url;
        await fs.promises.unlink(video);
        demo = await tx.demo.create({
          data: {
            url: videoUpload,
            courseId: courseId,
          },
        });
        return demo;
      },
      { timeout: 30_000 }
    );
    const response: IResponse = {
      status: "Success",
      statusCode: 201,
      data: {
        demo,
      },
    };
    return response;
  }
  async getOne(Payload: IGetDemoBody): Promise<IResponse> {
    const { courseId } = Payload;
    const isExist = await CourseExists(courseId);
    if (!isExist) throw new APIError("Invalid courseId", 404);
    const demo = await prisma.demo.findUnique({
      where: {
        courseId: courseId,
      },
    });
    if (!demo) throw new APIError("Course does not have a demo video", 400);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: {
        demo,
      },
    };
    return response;
  }

  async deleteDemo(Payload: IDeleteDemoBody) {
    const { courseId } = Payload;
    const isExist = await CourseExists(courseId);
    if (!isExist) throw new APIError("Invalid Course Id", 404);
    const demo = await prisma.demo.findUnique({
      where: {
        courseId: courseId,
      },
    });
    if (!demo) throw new APIError("Course does not have a demo video", 400);
    await prisma.demo.delete({
      where: {
        courseId: courseId,
      },
    });
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      message: "Demo video deleted successfully",
    };
    return response;
  }

  async updateOne(Payload: IUpdateDemoBody) {
    const { courseId, video } = Payload;
    const isExist = await CourseExists(courseId);
    if (!isExist) throw new APIError("Invalid Course Id", 404);
    let videoUpload = await uploadLargeVideo(video);
    videoUpload = videoUpload.secure_url;
    await fs.promises.unlink(video);
  }
}

export default new DemoService();
