import express from "express";
import { validate } from "../../utils/validation";
import { createCategoryValidation } from "./Category.validation";
import { createCategory, getCategories } from "./Category.controller";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("ADMIN"),
  validate(createCategoryValidation),
  createCategory
);
router.get("/", isAuthenticated, getCategories);

export const categoryRouter = router;
