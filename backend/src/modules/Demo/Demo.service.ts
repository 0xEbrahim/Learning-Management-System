import fs from "fs";
import cloudinary from "../../config/cloudinary";
import { IUploadDemoBody } from "./Demo.interface";
import prisma from "../../config/prisma";
import { IResponse } from "../../Interfaces/types";

class DemoService {
  async uploadDemo(Payload: IUploadDemoBody): Promise<IResponse> {
    const { courseId, video } = Payload;
    let videoUpload: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        video,
        {
          resource_type: "video",
          folder: "Videos",
          chunk_size: 6000000,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
    videoUpload = videoUpload.secure_url;
    fs.unlinkSync(video);
    const demo = await prisma.demo.create({
      data: {
        url: videoUpload,
        courseId: courseId,
      },
    });
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
