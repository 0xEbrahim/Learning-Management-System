import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import { validate } from "../../utils/validation";
import {
  createSectionValidation,
  deleteSectionByIdValidation,
  getSectionByIdValidation,
  getSectionsValidation,
} from "./Section.validation";
import {
  createSection,
  deleteSection,
  getSectionById,
  getSections,
} from "./Section.controller";
import isCourseAuthor from "../../middlewares/isCourseAuthor";
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  validate(createSectionValidation),
  isCourseAuthor,
  createSection
);
router.get("/", isAuthenticated, validate(getSectionsValidation), getSections);
router.get(
  "/:id",
  isAuthenticated,
  validate(getSectionByIdValidation),
  getSectionById
);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  validate(deleteSectionByIdValidation),
  isCourseAuthor,
  deleteSection
);
export const sectionRouter = router;
