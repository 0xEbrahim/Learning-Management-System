import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import { getNotifications } from "./Notification.controller";
const router = express.Router();

router.get("/", isAuthenticated, getNotifications);

export const notificationRouter = router;
