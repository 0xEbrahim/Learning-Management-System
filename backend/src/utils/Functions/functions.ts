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
  const hashed = await bcrypt.hash(password, 12);
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
  let link;
  if (config.NODE_ENV === "development")
    link = `${config.DEV_URL}/auth/verify-Email/${code}`;
  else link = `${config.PROD_URL}/auth/verify-Email/${code}`;
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
  let link;
  if (config.NODE_ENV === "development")
    link = `${config.DEV_URL}/auth/reset-password/${code}`;
  else link = `${config.PROD_URL}/auth/reset-password/${code}`;
  const data: IEmail = {
    email: user.email,
    subject: "Password Reset",
    template: generatePasswordResetTemplate(link),
  };
  await sendEmail(data);
};

export const cleanUsersData = (user: IUser) => {
  delete user.password;
  delete user.OTP;
  delete user.OTPExpiresAt;
  delete user.emailVerificationToken;
  delete user.emailVerificationTokenExpiresAt;
  delete user.passwordResetToken;
  delete user.passwordResetTokenExpiresAt;
  delete user.passwordChangedAt;
};
