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
import uplaoder from "../../config/multer";
import { orderRouter } from "../Order/Order.routes";
const router = express.Router({ mergeParams: true });

router.use("/:userId/orders", orderRouter);

router.get("/", isAuthenticated, getUsers);
router.get("/search", isAuthenticated, search);
router.get("/:id", isAuthenticated, validate(getUserByIdValidation), getUser);
router.patch(
  "/:id/update",
  isAuthenticated,
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
