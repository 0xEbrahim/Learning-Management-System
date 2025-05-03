import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import { validate } from "../../utils/validation";
import { createSectionValidation } from "./Section.validation";
import { createSection } from "./Section.controller";
const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  validate(createSectionValidation),
  createSection
);

export const sectionRouter = router;
