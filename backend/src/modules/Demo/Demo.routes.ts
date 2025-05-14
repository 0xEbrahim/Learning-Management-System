import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import isCourseAuthor from "../../middlewares/isCourseAuthor";
import { deleteDemo, getDemo, uploadDemo } from "./Demo.controller";
import uplaoder from "../../config/multer";
import {
  DeleteDemoValidation,
  GetDemoValidation,
  UpdateDemoValidation,
  uploadDemoValidation,
} from "./Demo.validation";
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
router.get("/", isAuthenticated, validate(GetDemoValidation), getDemo);
router.delete(
  "/",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  validate(DeleteDemoValidation),
  isCourseAuthor,
  deleteDemo
);
router.patch(
  "/",
  isAuthenticated,
  isAuthorized("TEACHER", "ADMIN"),
  uplaoder.single("video"),
  validate(UpdateDemoValidation),
  isCourseAuthor,
  uploadDemo
);
export const demoRouter = router;
