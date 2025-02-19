import express from "express";
import { validate } from "../../utils/validation";
import passport from "../../config/passport";
import {
  emailVerificationValidation,
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordTokenValidation,
  resetPasswordValidation,
} from "./Auth-Validation";
import config from "../../config/env";
import {
  forgotPassword,
  handleCallBack,
  login,
  refresh,
  register,
  resetPassword,
  sendEmailVerificationToken,
  verifyEmailVerificationToken,
  verifyResetPasswordToken,
} from "./Auth.Controller";
import uplaoder from "../../config/multer";
const router = express.Router();

router.post(
  "/register",
  uplaoder.single("image"),
  validate(registerValidation),
  register
);
router.post("/login", validate(loginValidation), login);
router.post(
  "/reset-password/:token",
  validate(resetPasswordTokenValidation),
  verifyResetPasswordToken,
  validate(resetPasswordValidation),
  resetPassword
);
router.get(
  "/verify-Email/:token",
  validate(emailVerificationValidation),
  verifyEmailVerificationToken
);
router.get("/refresh", refresh);
router.get(
  "/google",
  passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (req, res, next) => {
      next();
    }
  )
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      config.NODE_ENV === "development"
        ? `${config.DEV_URL}/auth/login`
        : `${config.PROD_URL}/auth/login`,
  }),
  handleCallBack
);
router.patch(
  "/forgot-password",
  validate(forgotPasswordValidation),
  forgotPassword
);
router.patch("/send-email", sendEmailVerificationToken);
export const authRouter = router;
