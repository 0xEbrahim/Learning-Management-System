import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../../config/prisma";
import { IEmail } from "../../Interfaces/types";
import { generateEmailVerifyTemplate } from "../../views/emailVerifyTemplate";
import config from "../../config/env";
import sendEmail from "../../config/email";
import { IUser } from "../../modules/User/User.interface";
import { generatePasswordResetTemplate } from "../../views/passwordResetTemplate";
export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
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
  await sendEmail(data);
};

export const createResetPasswordToken = async (user: IUser) => {
  const code = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(code).digest("hex");

  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: hashed,
      passwordResetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  let link = `${config.FRONT_END_BASE}/reset-password/${code}`;
  const data: IEmail = {
    email: user.email,
    subject: "Password Reset",
    template: generatePasswordResetTemplate(link),
  };
  await sendEmail(data);
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
    ...props,
  ];
  deleted.forEach((el) => delete user[el]);
};
