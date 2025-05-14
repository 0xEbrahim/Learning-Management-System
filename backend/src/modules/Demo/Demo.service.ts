import fs from "fs";
import cloudinary from "../../config/cloudinary";
import { IUploadDemoBody } from "./Demo.interface";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";
import { uploadLargeVideo } from "../../utils/Functions/functions";

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
}

export default new DemoService();
