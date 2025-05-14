import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  search,
  updateCourse,
  updateCourseThumbnail,
} from "./Course.controller";
import uplaoder from "../../config/multer";

import {
  createCourseValidation,
  deleteCourseValidation,
  getCourseByIdValidation,
  updateCourseValidation,
  updateCourseThumbnailValidation,
} from "./Course.validation";
import { validate } from "../../utils/validation";
import { videoRouter } from "../Video/Video.routes";
import { userRouter } from "../User/User.routes";
import { reviewRouter } from "../Review/Review.routes";
import { sectionRouter } from "../Sections/Section.routes";
import { demoRouter } from "../Demo/Demo.routes";
const router = express.Router({ mergeParams: true });

router.use("/:courseId/sections", sectionRouter);
router.use("/:courseId/videos", videoRouter);
router.use("/:courseId/users", userRouter);
router.use("/:courseId/reviews", reviewRouter);
router.use("/:courseId/demo", demoRouter);
router.post(
  "/",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  uplaoder.single("image"),
  validate(createCourseValidation),
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
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  validate(deleteCourseValidation),
  deleteCourse
);
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  validate(updateCourseValidation),
  updateCourse
);
router.patch(
  "/:id/thumbnail",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  uplaoder.single("image"),
  validate(updateCourseThumbnailValidation),
  updateCourseThumbnail
);

export const courseRouter = router;
