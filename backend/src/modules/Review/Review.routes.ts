import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import { createReview } from "./Review.controller";
import isBuyer from "../../middlewares/isBuyer";
import { createReviewValidation } from "./Review.validation";
import { validate } from "../../utils/validation";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuthenticated,
  isBuyer,
  validate(createReviewValidation),
  createReview
);

export const reviewRouter = router;
