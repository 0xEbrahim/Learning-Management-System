import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import isAuthorized from "../../middlewares/isAuthorized";
import {
  createCheckoutSession,
  getAllOrders,
  getOrder,
  verifyOrder,
  webhooks,
} from "./Order.controller";

const router = express.Router({ mergeParams: true });

router.post("/create-checkout-session", isAuthenticated, createCheckoutSession);
router.post("/success", isAuthenticated, verifyOrder);
router.post("/webhook", express.raw({ type: "application/json" }), webhooks);
router.get("/", isAuthenticated, getAllOrders);
router.get("/:id", isAuthenticated, isAuthorized("ADMIN"), getOrder);
export const orderRouter = router;
