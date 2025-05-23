import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../../config/prisma";
import { IEmail } from "../../Interfaces/types";
import { generateEmailVerifyTemplate } from "../../views/emailVerifyTemplate";
import config from "../../config/env";
import sendEmail from "../../config/email";
import { IUser } from "../../modules/User/User.interface";
import { generatePasswordResetTemplate } from "../../views/passwordResetTemplate";
import { generateAccountReactiveTemplate } from "../../views/accountReactive";
import APIError from "../APIError";
import cloudinary from "../../config/cloudinary";
import { queue } from "../../Queue/queue";

export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};

export const CourseExists = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      buyers: true,
    },
  });
  return course;
};

export const isCourseAuthor = async (
  courseId: string,
  userId: string
): Promise<boolean> => {
  const course = await CourseExists(courseId);
  if (!course) throw new APIError("Invalid course ID", 404);
  if (course.publisherId.toString() === userId.toString()) return true;
  else return false;
};

export const isCourseBuyer = async (
  courseId: string,
  userId: string
): Promise<boolean> => {
  const course = await CourseExists(courseId);
  if (!course) throw new APIError("Invalid course ID", 404);
  const buyersOfCourse = course.buyers;
  const isBuyer = buyersOfCourse.some(
    (el) => el.userId.toString() === userId.toString()
  );
  return isBuyer;
};
export const uploadLargeVideo = (path: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      path,
      {
        resource_type: "video",
        folder: "Videos",
        chunk_size: 6000000,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

export const isCourseBuyerOrAuthor = async (
  courseId: string,
  userId: string
): Promise<boolean> => {
  const isAuthor = await isCourseAuthor(courseId, userId);
  const isBuyer = isCourseBuyer(courseId, userId);
  return isAuthor || isBuyer;
};

export const comparePassword = async (password: string, hashed: string) => {
  return await bcrypt.compare(password, hashed);
};

export const createEmailVerifyToken = async (user: IUser) => {
  const code = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(code).digest("hex");
  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerificationToken: hashed,
      emailVerificationTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  let link = `${config.FRONT_END_BASE}/verifyEmail/${code}`;
  const data: IEmail = {
    email: user.email,
    subject: "Email Verify",
    template: generateEmailVerifyTemplate(link),
  };
  // await sendEmail(data);
  await queue.add("email", data, {
    attempts: 50,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });
};

export const createReactiveEmail = async (user: IUser) => {
  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isActive: true,
    },
  });
  const data: IEmail = {
    email: user.email,
    subject: "Account activation",
    template: generateAccountReactiveTemplate(user.name),
  };
  await sendEmail(data);
};

export const createResetPasswordToken = async (user: IUser) => {
  const code = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(code).digest("hex");
  let link = `${config.FRONT_END_BASE}/resetPassword/${code}`;
  const data: IEmail = {
    email: user.email,
    subject: "Password Reset",
    template: generatePasswordResetTemplate(link),
  };
  await sendEmail(data);
  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: hashed,
      passwordResetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
};

export const cleanVideoData = (video: any) => {
  const deleted = ["videoUrl"];
  deleted.forEach((el) => delete video[el]);
};

export const updateCourseRating = async (courseId: string) => {
  const averageRatePerCourse = await prisma.review.aggregate({
    where: {
      courseId: courseId,
    },
    _avg: {
      rating: true,
    },
  });
  const { _avg } = averageRatePerCourse;
  const { rating } = _avg;
  await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      averageRatings: rating ?? 0,
    },
  });
};

export const cleanUsersData = (user: any, ...props: any) => {
  const deleted = [
    "password",
    "OTP",
    "OTPExpiresAt",
    "emailVerificationToken",
    "emailVerificationTokenExpiresAt",
    "passwordResetToken",
    "passwordResetTokenExpiresAt",
    "passwordChangedAt",
    "emailVerified",
    "deleteAt",
    "isActive",
    ...props,
  ];
  deleted.forEach((el) => delete user[el]);
};
