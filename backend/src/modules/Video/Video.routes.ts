import express from "express";
import uplaoder from "../../config/multer";
import { validate } from "../../utils/validation";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import {
  VideoValidation,
  getVideoOnCourseValidation,
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
import isBuyer from "../../middlewares/isBuyer";
import isCourseAuthor from "../../middlewares/isCourseAuthor";
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
  "/",
  isAuthenticated,
  validate(getVideoOnCourseValidation),
  getVideosOnCourse
);
router.get(
  "/:videoId",
  isAuthenticated,
  validate(VideoValidation),
  isBuyer,
  getVideoById
);
router.patch(
  "/:videoId",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  validate(updateVideoValidation),
  isCourseAuthor,
  updateVideo
);
router.delete(
  "/:videoId",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  validate(VideoValidation),
  isCourseAuthor,
  deleteVideo
);
router.patch(
  "/:videoId/video",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  uplaoder.fields([{ name: "video", maxCount: 1 }]),
  validate(VideoValidation),
  isCourseAuthor,
  editVideoCtrl
);
router.patch(
  "/:videoId/thumbnail",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  uplaoder.fields([{ name: "image", maxCount: 1 }]),
  validate(VideoValidation),
  isCourseAuthor,
  editThumbnail
);
export const videoRouter = router;
