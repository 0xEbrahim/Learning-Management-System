import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import passport from "./config/passport";
import config from "./config/env";
import { authRouter } from "./modules/Auth/Auth.Routes";
import { globalErrorHandler } from "./middlewares/globalError";
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
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1/auth", authRouter);
app.get("/", (req, res, next) => {
  res.send("KKK");
});
app.use(globalErrorHandler);
export default app;
