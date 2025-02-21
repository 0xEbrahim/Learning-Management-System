import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import {
  getUserById,
  getUserProfile,
  getUsers,
  search,
  updateUser,
} from "./User.controller";
import { validate } from "../../utils/validation";
import { getUserByIdValidation, updateUserValidation } from "./User.validation";
import isAuthorized from "../../middlewares/isAuthorized";
const router = express.Router();

router.get("/", isAuthenticated, getUsers);
router.get("/me", isAuthenticated, getUserProfile);
router.get("/search", isAuthenticated, search);
router.get(
  "/:id",
  isAuthenticated,
  validate(getUserByIdValidation),
  getUserById
);
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("ADMIN"),
  validate(updateUserValidation),
  updateUser
);
export const userRouter = router;
