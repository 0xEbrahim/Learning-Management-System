import express from "express";
import uplaoder from "../../config/multer";
import { validate } from "../../utils/validation";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import isOwner from "../../middlewares/isOwner";
import { VideoValidation, uploadVideoValidation } from "./Video.validation";
import { deleteVideo, getVideoById, uploadVideo } from "./Video.controller";
import isBuyer from "../../middlewares/isBuyer";
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  isOwner,
  uplaoder.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  validate(uploadVideoValidation),
  uploadVideo
);
router.get(
  "/:videoId",
  isAuthenticated,
  validate(VideoValidation),
  isBuyer,
  getVideoById
);
router.delete(
  "/:videoId",
  isAuthenticated,
  isAuthorized("ADMIN", "TEACHER"),
  isOwner,
  validate(VideoValidation),
  deleteVideo
);
export const videoRouter = router;
