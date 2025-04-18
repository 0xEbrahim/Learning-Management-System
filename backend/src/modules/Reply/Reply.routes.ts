import express from "express";
import { ReplyOnReview } from "./Reply.controller";
import isAuthenticated from "../../middlewares/isAuthenticated";
import { validate } from "../../utils/validation";
import { replyOnReviewValidation } from "./Reply.validation";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuthenticated,
  validate(replyOnReviewValidation),
  ReplyOnReview
);

export const replyRouter = router;
