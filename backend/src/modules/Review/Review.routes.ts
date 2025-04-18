import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import {
  createReview,
  deleteReview,
  getReviewById,
  getReviewsOnCourse,
  updateReview,
} from "./Review.controller";
import isBuyer from "../../middlewares/isBuyer";
import {
  createReviewValidation,
  deleteReviewValidation,
  getReviewByIdValidation,
  getReviewsOnCourseValidation,
  updateReviewValidation,
} from "./Review.validation";
import { validate } from "../../utils/validation";
import { replyRouter } from "../Reply/Reply.routes";

const router = express.Router({ mergeParams: true });

router.use("/:id/replies", replyRouter);

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
router.delete(
  "/:id",
  isAuthenticated,
  validate(deleteReviewValidation),
  deleteReview
);
router.patch(
  "/:id",
  isAuthenticated,
  validate(updateReviewValidation),
  updateReview
);
export const reviewRouter = router;
