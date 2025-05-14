import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import isCourseAuthor from "../../middlewares/isCourseAuthor";
import { uploadDemo } from "./Demo.controller";
import uplaoder from "../../config/multer";
import { uploadDemoValidation } from "./Demo.validation";
import { validate } from "../../utils/validation";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  uplaoder.single("video"),
  validate(uploadDemoValidation),
  isCourseAuthor,
  uploadDemo
);

export const demoRouter = router;
