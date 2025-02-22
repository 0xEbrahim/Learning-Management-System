import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import {
  createCourse,
  getCourseById,
  getCourses,
  search,
} from "./Course.controller";
import uplaoder from "../../config/multer";

import {
  createCourseValidation,
  getCourseByIdValidation,
} from "./Course.validation";
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
router.get("/", isAuthenticated, getCourses);
router.get("/search", isAuthenticated, search);
router.get(
  "/:id",
  isAuthenticated,
  validate(getCourseByIdValidation),
  getCourseById
);

export const courseRouter = router;
