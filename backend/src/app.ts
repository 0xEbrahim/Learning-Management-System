import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import config from "./config/env";
dotenv.config();
const app = express();
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 500,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cors());
app.use(cookieParser());
app.use(helmet());
export default app;
