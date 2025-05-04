import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import {
  createReview,
  deleteReview,
  getReviewById,
  getReviewsOnCourse,
  updateReview,
} from "./Review.controller";
import {
  createReviewValidation,
  deleteReviewValidation,
  getReviewByIdValidation,
  getReviewsOnCourseValidation,
  updateReviewValidation,
} from "./Review.validation";
import { validate } from "../../utils/validation";
import { replyRouter } from "../Reply/Reply.routes";
import hasAccess from "../../middlewares/hasAccess";

const router = express.Router({ mergeParams: true });

router.use("/:id/replies", replyRouter);

router.post(
  "/",
  isAuthenticated,
  validate(createReviewValidation),
  hasAccess,
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
  hasAccess,
  deleteReview
);
router.patch(
  "/:id",
  isAuthenticated,
  validate(updateReviewValidation),
  hasAccess,
  updateReview
);
export const reviewRouter = router;
