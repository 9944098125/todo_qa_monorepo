import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth";
import qaRoute from "./routes/qa";
import todoRoute from "./routes/todo";
import adminRoute from "./routes/admin";
import toolsRoute from "./routes/tool";
import { connect } from "./dbConnection/db";
import { sendError } from "./helpers/response";

dotenv.config();

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://todo-qa-monorepo-frontend-one.vercel.app",
];

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      try {
        const url = new URL(origin);
        if (
          allowedOrigins.includes(origin) ||
          /\.vercel\.app$/.test(url.hostname)
        ) {
          return callback(null, true);
        }
      } catch {
        // ignore invalid origin
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/qa", qaRoute);
app.use("/api/todo", todoRoute);
app.use("/api/admin", adminRoute);
app.use("/api/tools", toolsRoute);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
  const errStatus = error.status || 500;
  const errMessage = error.message || "Something went wrong";
  sendError(req, res, errStatus, errMessage, {
    stack: error.stack,
  });
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  connect();
  console.log(`Server is running on ${port}`);
});
