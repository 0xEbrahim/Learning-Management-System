import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import {
  createCheckoutSession,
  getAllOrders,
  getOrder,
  verifyOrder,
  webhooks,
} from "./Order.controller";

const router = express.Router({ mergeParams: true });

router.post("/create-checkout-session", isAuthenticated, createCheckoutSession);
router.get("/success", verifyOrder);
router.post("/webhook", express.raw({ type: "application/json" }), webhooks);
router.get("/", isAuthenticated, getAllOrders);
router.get("/:id", isAuthenticated, getOrder);
export const orderRouter = router;
