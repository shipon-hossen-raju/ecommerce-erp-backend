import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import httpStatus from "http-status";
import morgan from "morgan";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import config from "./config";
import { healthCheckRouter } from "./utils/Healthcheck.route";

const app: Application = express();

export const corsOptions = {
  origin: config.corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("trust proxy", 1);
app.set("etag", false);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 500,
  message: "Too many requests from this IP, please try again after an hour",
});

const loggerFormat =
  ":remote-addr :method :url :status :res[content-length] - :response-time ms";

app.use(limiter);
app.use(morgan(loggerFormat));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(healthCheckRouter);

// Router setup
app.use("/api/v1", router);

// Error handling middleware
app.use(GlobalErrorHandler);

// Not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
