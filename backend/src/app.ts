import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import rateLimit from "express-rate-limit";
import YAML from "yamljs";
import path from "path";
import ExpressMongoSanitize from "express-mongo-sanitize";
import SwaggerUI from "swagger-ui-express";
import dotenv from "dotenv";

// Config & Utilities
import passport from "./config/passport";
import config from "./config/env";
import redis from "./config/redis";
import connectSocket from "./Sockets/connect.socket";

// Middlewares
import { globalErrorHandler, notFound } from "./middlewares/globalError";

// Routes
import { authRouter } from "./modules/Auth/Auth.Routes";
import { userRouter } from "./modules/User/User.routes";
import { courseRouter } from "./modules/Course/Course.routes";
import { categoryRouter } from "./modules/Category/Category.routes";
import { videoRouter } from "./modules/Video/Video.routes";
import { orderRouter } from "./modules/Order/Order.routes";
import { reviewRouter } from "./modules/Review/Review.routes";
import { replyRouter } from "./modules/Reply/Reply.routes";
import { sectionRouter } from "./modules/Sections/Section.routes";
import { notificationRouter } from "./modules/Notification/Notifications.routes";

dotenv.config();

const app = express();
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
connectSocket(io);

// Swagger setup
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerOptions } from "./config/swagger";
import { demoRouter } from "./modules/Demo/Demo.routes";
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
  validate: { xForwardedForHeader: false },
});

// Middleware
app.use(ExpressMongoSanitize());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin:
      config.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://learning-management-system-frontend-5rpd.onrender.com",
    credentials: true,
  })
);
app.use(limiter);
app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));
app.use(helmet());

// Session & Passport
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: config.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Health Check & Redis Flush Endpoint
app.get("/", async (req, res) => {
  await redis.flushAll();
  console.log("Cache DB cleared");
  res.json({ message: "Hello to LMS API" });
});

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/replies", replyRouter);
app.use("/api/v1/sections", sectionRouter);
app.use("/api/v1/demo", demoRouter);
app.use("/api/v1/notifications", notificationRouter);

// Error Handling
app.all("*", notFound);
app.use(globalErrorHandler);

export default server;
