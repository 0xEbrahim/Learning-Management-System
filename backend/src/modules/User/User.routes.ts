import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import {
  getUser,
  getUserById,
  getUsers,
  search,
  updateUser,
} from "./User.controller";
import { validate } from "../../utils/validation";
import { getUserByIdValidation, updateUserValidation } from "./User.validation";
import isAuthorized from "../../middlewares/isAuthorized";
const router = express.Router();

router.get("/", isAuthenticated, getUsers);
router.get("/:id", isAuthenticated, validate(getUserByIdValidation), getUser);
router.get("/search", isAuthenticated, search);
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("ADMIN"),
  validate(updateUserValidation),
  updateUser
);
export const userRouter = router;
