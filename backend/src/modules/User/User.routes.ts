import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import { getUserById, getUsers, search } from "./User.controller";
import { validate } from "../../utils/validation";
import { getUserByIdValidation } from "./User.validation";
const router = express.Router();

router.get("/", isAuthenticated, getUsers);
router.get("/search", isAuthenticated, search);
router.get(
  "/:id",
  isAuthenticated,
  validate(getUserByIdValidation),
  getUserById
);
export const userRouter = router;
