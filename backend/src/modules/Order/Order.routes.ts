import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import {
  createCheckoutSession,
  verifyOrder,
  webhooks,
} from "./Order.controller";

const router = express.Router();

router.post("/create-checkout-session", isAuthenticated, createCheckoutSession);
router.post("/success", isAuthenticated, verifyOrder);
router.post("/webhook", express.raw({ type: "application/json" }), webhooks);

export const orderRouter = router;
