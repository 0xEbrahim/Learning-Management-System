import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import { createCheckoutSession, verifyOrder } from "./Order.controller";

const router = express.Router();

router.post("/create-checkout-session", isAuthenticated, createCheckoutSession);
router.post("/success", isAuthenticated, verifyOrder);
export const orderRouter = router;
