import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  search,
} from "./Course.controller";
import uplaoder from "../../config/multer";

import {
  createCourseValidation,
  deleteCourseValidation,
  getCourseByIdValidation,
} from "./Course.validation";
import { validate } from "../../utils/validation";
import { videoRouter } from "../Video/Video.routes";
const router = express.Router({ mergeParams: true });

router.use("/:courseId/videos", videoRouter);

router.post(
  "/",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  uplaoder.single("image"),
  validate(createCourseValidation),
  createCourse
);
router.get("/", isAuthenticated, isAuthorized("ADMIN"), getCourses);
router.get("/search", isAuthenticated, search);
router.get(
  "/:id",
  isAuthenticated,
  validate(getCourseByIdValidation),
  getCourseById
);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  validate(deleteCourseValidation),
  deleteCourse
);

export const courseRouter = router;
