import express from "express";
import { validate } from "../../utils/validation";
import {
  createCategoryValidation,
  getCategoryByIdValidation,
} from "./Category.validation";
import {
  createCategory,
  getCategories,
  getCategoryById,
} from "./Category.controller";
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
router.get(
  "/:id",
  isAuthenticated,
  validate(getCategoryByIdValidation),
  getCategoryById
);
export const categoryRouter = router;
