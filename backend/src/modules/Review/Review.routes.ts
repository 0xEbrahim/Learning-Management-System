import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import { createReview } from "./Review.controller";
import isBuyer from "../../middlewares/isBuyer";

const router = express.Router({ mergeParams: true });

router.post("/", isAuthenticated, isBuyer, createReview);

export const reviewRouter = router;
