import express from "express";
import client from "prom-client";
import morgan from "morgan";
import helmet from "helmet";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import rateLimit from "express-rate-limit";
import ExpressMongoSanitize from "express-mongo-sanitize";
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
const register = new client.Registry();
client.collectDefaultMetrics({ register });
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
import { arenaConfig } from "./Queue/Arena-queue";
import logger from "./config/logger";
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Process handling
process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
    logger.error(reason + " Unhandled Rejection at Promise " + p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    logger.error(err + " Uncaught Exception thrown");
    process.exit(1);
  });

// Rate Limiting
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
  validate: { xForwardedForHeader: false },
});

// metrics
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});
register.registerMetric(httpRequestsTotal);

// Histogram: HTTP request duration
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5],
});
register.registerMetric(httpRequestDuration);

// Gauge: active requests count
const activeRequests = new client.Gauge({
  name: "active_requests",
  help: "Number of active HTTP requests",
});
register.registerMetric(activeRequests);

// Middleware to track requests
app.use((req, res, next) => {
  if (req.path === "/metrics") {
    return next();
  }
  activeRequests.inc();
  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    activeRequests.dec();
    httpRequestsTotal
      .labels(req.method, req.path, res.statusCode.toString())
      .inc();
    end({
      method: req.method,
      route: req.path,
      status: res.statusCode.toString(),
    });
  });
  next();
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
app.use("/", arenaConfig);
// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

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
