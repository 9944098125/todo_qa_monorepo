"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTodoDescription =
  exports.deleteTodo =
  exports.updateTodo =
  exports.getTodoWithUserId =
  exports.createTodo =
    void 0;
const Todo_1 = __importDefault(require("../models/Todo"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const response_1 = require("../helpers/response");
const streamOpenRouterCompletion_1 = require("../helpers/streamOpenRouterCompletion");
dotenv_1.default.config();
// open ai api key
const createTodo = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { title, description, urgency, deadline, userId, isCompleted } =
        req.body;
      const user = yield User_1.default.findOne({ _id: userId });
      const newTodo = new Todo_1.default({
        title,
        description,
        urgency,
        deadline,
        userId,
        isCompleted: typeof isCompleted === "boolean" ? isCompleted : false,
      });
      yield newTodo.save();
      (0, response_1.sendSuccess)(
        req,
        res,
        201,
        `Hola ${user === null || user === void 0 ? void 0 : user.name}, you have created a new todo ${newTodo.title} 🤩`,
        { todo: newTodo },
      );
    } catch (err) {
      next(err);
    }
  });
exports.createTodo = createTodo;
const getTodoWithUserId = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const { userId } = req.params;
      const user = yield User_1.default.findOne({ _id: userId });
      const { page, limit, skip } = (0, response_1.getPagination)(req, 10);
      const filterParam =
        ((_a = req.query.filter) === null || _a === void 0
          ? void 0
          : _a.toLowerCase()) || "all";
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );
      const endOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );
      const startOfTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0,
      );
      const endOfTomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        23,
        59,
        59,
        999,
      );
      const endOfNext3Days = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 3,
        23,
        59,
        59,
        999,
      );
      const query = { userId };
      switch (filterParam) {
        case "completed":
          query.isCompleted = true;
          break;
        case "pending":
          query.isCompleted = { $ne: true };
          break;
        case "overdue":
          query.isCompleted = { $ne: true };
          query.deadline = { $lt: startOfToday.toISOString() };
          break;
        case "today":
          query.isCompleted = { $ne: true };
          query.deadline = {
            $gte: startOfToday.toISOString(),
            $lte: endOfToday.toISOString(),
          };
          break;
        case "tomorrow":
          query.isCompleted = { $ne: true };
          query.deadline = {
            $gte: startOfTomorrow.toISOString(),
            $lte: endOfTomorrow.toISOString(),
          };
          break;
        case "next3days":
          query.isCompleted = { $ne: true };
          query.deadline = {
            $gte: startOfToday.toISOString(),
            $lte: endOfNext3Days.toISOString(),
          };
          break;
        case "upcoming":
          query.isCompleted = { $ne: true };
          query.deadline = { $gt: endOfNext3Days.toISOString() };
          break;
        case "all":
        default:
          // All tasks for this user
          break;
      }
      const totalDocuments = yield Todo_1.default.countDocuments(query);
      const todoList = yield Todo_1.default
        .find(query)
        .sort({ isCompleted: 1, deadline: 1 })
        .skip(skip)
        .limit(limit);
      (0, response_1.sendPaginated)(req, res, {
        message: `Hola ${user === null || user === void 0 ? void 0 : user.name}, here is your todo list 🤩`,
        documents: todoList,
        pageNumber: page,
        pageSize: limit,
        totalPages: (0, response_1.totalPages)(totalDocuments, limit),
        totalDocuments,
      });
    } catch (err) {
      next(err);
    }
  });
exports.getTodoWithUserId = getTodoWithUserId;
const updateTodo = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { todoId } = req.params;
      const { title, description, urgency, deadline, userId, isCompleted } =
        req.body;
      const user = yield User_1.default.findOne({ _id: userId });
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (urgency !== undefined) updateData.urgency = urgency;
      if (deadline !== undefined) updateData.deadline = deadline;
      if (userId !== undefined) updateData.userId = userId;
      if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
      const updatedTodo = yield Todo_1.default.findByIdAndUpdate(
        todoId,
        updateData,
        {
          new: true,
        },
      );
      (0, response_1.sendSuccess)(
        req,
        res,
        200,
        `Hola ${user === null || user === void 0 ? void 0 : user.name}, you have updated the todo ${updatedTodo === null || updatedTodo === void 0 ? void 0 : updatedTodo.title} successfully 🤩`,
        { todo: updatedTodo },
      );
    } catch (err) {
      next(err);
    }
  });
exports.updateTodo = updateTodo;
const deleteTodo = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { todoId } = req.params;
      const user = yield User_1.default.findOne({ _id: req.params.userId });
      yield Todo_1.default.findByIdAndDelete(todoId);
      (0, response_1.sendSuccess)(
        req,
        res,
        200,
        `Hola ${user === null || user === void 0 ? void 0 : user.name}, you have deleted the todo successfully 🤩`,
      );
    } catch (err) {
      next(err);
    }
  });
exports.deleteTodo = deleteTodo;
const generateTodoDescription = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { todoTitle } = req.body;
      if (typeof todoTitle !== "string" || !todoTitle.trim()) {
        (0, response_1.sendError)(req, res, 400, "Todo title is required");
        return;
      }
      yield (0, streamOpenRouterCompletion_1.streamOpenRouterCompletion)(
        req,
        res,
        {
          messages: [
            {
              role: "system",
              content:
                "You are a productivity assistant. Generate a short, clear task description based on the given title. Return ONLY the description text. No headings, no quotes.",
            },
            {
              role: "user",
              content: todoTitle.trim(),
            },
          ],
          maxTokens: 60,
          temperature: 0.3,
        },
      );
    } catch (error) {
      if (!res.headersSent) {
        next(error);
      }
    }
  });
exports.generateTodoDescription = generateTodoDescription;
