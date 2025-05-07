import express from "express";
import uplaoder from "../../config/multer";
import { validate } from "../../utils/validation";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import {
  deleteVideoValidation,
  editVideoValidation,
  getVideoByIdValidation,
  getVideosOnCourseValidation,
  updateVideoValidation,
  uploadVideoValidation,
} from "./Video.validation";
import {
  deleteVideo,
  editThumbnail,
  editVideoCtrl,
  getVideoById,
  getVideosOnCourse,
  updateVideo,
  uploadVideo,
} from "./Video.controller";
import isCourseAuthor from "../../middlewares/isCourseAuthor";
import hasAccess from "../../middlewares/hasAccess";

const router = express.Router({ mergeParams: true });


router.post(
  "/",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  uplaoder.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  validate(uploadVideoValidation),
  isCourseAuthor,
  uploadVideo
);


router.get(
  "/:videoId",
  isAuthenticated,
  validate(getVideoByIdValidation),
  hasAccess,
  getVideoById
);


router.get(
  "/",
  isAuthenticated,
  validate(getVideosOnCourseValidation),
  hasAccess,
  getVideosOnCourse
);


router.patch(
  "/:videoId",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  validate(updateVideoValidation),
  isCourseAuthor,
  updateVideo
);


router.put(
  "/:videoId/edit",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  uplaoder.single("video"),
  validate(editVideoValidation),
  isCourseAuthor,
  editVideoCtrl
);


router.put(
  "/:videoId/thumbnail",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  uplaoder.single("image"),
  validate(getVideoByIdValidation),
  isCourseAuthor,
  editThumbnail
);


router.delete(
  "/:videoId",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  validate(deleteVideoValidation),
  isCourseAuthor,
  deleteVideo
);

export const videoRouter = router;
