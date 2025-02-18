import express from "express";
import { validate } from "../../utils/validation";
import passport from "../../config/passport";
import {
  emailVerificationValidation,
  loginValidation,
  registerValidation,
} from "./Auth-Validation";
import {
  login,
  refresh,
  register,
  sendEmailVerificationToken,
  verifyEmailVerificationToken,
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
router.get(
  "/verify-Email/:token",
  validate(emailVerificationValidation),
  verifyEmailVerificationToken
);
router.get("/refresh", refresh);
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);
router.patch("/send-email", sendEmailVerificationToken);
export const authRouter = router;
