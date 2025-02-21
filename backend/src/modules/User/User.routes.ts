import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import {
  deactivateAccount,
  getUser,
  getUsers,
  search,
  updateProfilePic,
  updateUser,
} from "./User.controller";
import { validate } from "../../utils/validation";
import { getUserByIdValidation, updateUserValidation } from "./User.validation";
import isAuthorized from "../../middlewares/isAuthorized";
import uplaoder from "../../config/multer";
const router = express.Router();

router.get("/", isAuthenticated, getUsers);
router.get("/search", isAuthenticated, search);
router.get("/:id", isAuthenticated, validate(getUserByIdValidation), getUser);
router.patch(
  "/:id/update",
  isAuthenticated,
  isAuthorized("ADMIN"),
  validate(updateUserValidation),
  updateUser
);
router.patch("/:id/deactivate", isAuthenticated, deactivateAccount);

router.patch(
  "/:id/update/pic",
  isAuthenticated,
  uplaoder.single("image"),
  updateProfilePic
);
export const userRouter = router;
