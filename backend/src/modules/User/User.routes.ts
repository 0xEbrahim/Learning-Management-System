import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import { getUserById, getUsers } from "./User.controller";
const router = express.Router();

router.get("/", isAuthenticated, getUsers);
router.get("/:id", isAuthenticated, getUserById);
export const userRouter = router;
