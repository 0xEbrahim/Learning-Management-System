import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import { validate } from "../../utils/validation";
import {
  createSectionValidation,
  getSectionByIdValidation,
  getSectionsValidation,
} from "./Section.validation";
import {
  createSection,
  getSectionById,
  getSections,
} from "./Section.controller";
const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  validate(createSectionValidation),
  createSection
);

router.get("/", isAuthenticated, validate(getSectionsValidation), getSections);
router.get(
  "/:id",
  isAuthenticated,
  validate(getSectionByIdValidation),
  getSectionById
);
export const sectionRouter = router;
