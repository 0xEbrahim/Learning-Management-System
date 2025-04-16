import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import {
  createReview,
  getReviewById,
  getReviewsOnCourse,
} from "./Review.controller";
import isBuyer from "../../middlewares/isBuyer";
import {
  createReviewValidation,
  getReviewByIdValidation,
  getReviewsOnCourseValidation,
} from "./Review.validation";
import { validate } from "../../utils/validation";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuthenticated,
  isBuyer,
  validate(createReviewValidation),
  createReview
);
router.get(
  "/",
  isAuthenticated,
  validate(getReviewsOnCourseValidation),
  getReviewsOnCourse
);
router.get(
  "/:id",
  isAuthenticated,
  validate(getReviewByIdValidation),
  getReviewById
);
export const reviewRouter = router;
