import { Roles } from "@prisma/client";

export interface IUser {
  id: string;
  googleId: string | null;
  name: string;
  avatar: string | null;
  email: string;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpiresAt?: Date | null;
  emailVerified: boolean;
  password?: string | null;
  passwordChangedAt?: Date | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiresAt?: Date | null;
  role: Roles;
  isActive: boolean;
  twoFactorAuth: boolean;
  deleteAt?: Date | null;
  OTP?: string | null;
  OTPExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUserBody {
  id?: string;
  name?: string;
}

export interface IUpdateProfilePicBody {
  id?: string;
  avatar?: string;
  remove?: true;
}
