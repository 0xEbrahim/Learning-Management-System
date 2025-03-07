import express from "express";
import uplaoder from "../../config/multer";
import { validate } from "../../utils/validation";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import isOwner from "../../middlewares/isOwner";
import { uploadVideoValidation } from "./Video.validation";
import { uploadVideo } from "./Video.controller";
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

export const videoRouter = router;
