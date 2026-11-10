"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const ai_1 = __importDefault(require("./routes/ai"));
const qa_1 = __importDefault(require("./routes/qa"));
const todo_1 = __importDefault(require("./routes/todo"));
const admin_1 = __importDefault(require("./routes/admin"));
const tool_1 = __importDefault(require("./routes/tool"));
const db_1 = require("./dbConnection/db");
const response_1 = require("./helpers/response");
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = [
  "http://localhost:3000",
  "https://todo-qa-monorepo-frontend-one.vercel.app",
];
app.set("trust proxy", 1);
app.use(
  (0, cors_1.default)({
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
      } catch (_a) {
        // ignore invalid origin
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth", auth_1.default);
app.use("/api/qa", qa_1.default);
app.use("/api/todo", todo_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/tools", tool_1.default);
app.use("/api/ai", ai_1.default);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});
app.use((error, req, res, next) => {
  const errStatus = error.status || 500;
  const errMessage = error.message || "Something went wrong";
  (0, response_1.sendError)(req, res, errStatus, errMessage, {
    stack: error.stack,
  });
});
const port = process.env.PORT || 5001;
app.listen(port, () => {
  (0, db_1.connect)();
  console.log(`Server is running on ${port}`);
});
