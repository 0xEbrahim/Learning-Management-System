import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import { validate } from "../../utils/validation";
import { getMessagePrvValidation } from "./Message.validation";
import { getAllMessages } from "./Message.controller";
const router = express.Router();

router.get(
  "/:id",
  isAuthenticated,
  validate(getMessagePrvValidation),
  getAllMessages
);

export const MessageRouter = router;
