import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import { createCourse } from "./Course.controller";
import uplaoder from "../../config/multer";

import { createCourseValidation } from "./Course.validation";
import { validate } from "../../utils/validation";
const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("TEACHER"),
  validate(createCourseValidation),
  uplaoder.single("image"),
  createCourse
);

export const courseRouter = router;
