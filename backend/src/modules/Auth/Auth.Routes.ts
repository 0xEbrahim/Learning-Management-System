import express from "express";
import { validate } from "../../utils/validation";
import {
  emailVerificationValidation,
  registerValidation,
} from "./Auth-Validation";
import {
  register,
  sendEmailVerificationToken,
  verifyEmailVerificationToken,
} from "./Auth.Controller";
import uplaoder from "../../config/multer";
const router = express.Router();

router.post(
  "/",
  uplaoder.single("image"),
  validate(registerValidation),
  register
);
router.get(
  "/verify-Email/:token",
  validate(emailVerificationValidation),
  verifyEmailVerificationToken
);
router.patch("/send-email", sendEmailVerificationToken);
export const authRouter = router;
