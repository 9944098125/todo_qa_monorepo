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
exports.generateAnswerWithAI =
  exports.deleteQa =
  exports.updateQa =
  exports.getQa =
  exports.createQa =
    void 0;
const Qa_1 = __importDefault(require("../models/Qa"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const response_1 = require("../helpers/response");
const streamOpenRouterCompletion_1 = require("../helpers/streamOpenRouterCompletion");
dotenv_1.default.config();
const createQa = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { question, answer, userId, toolId, importance } = req.body;
      const user = yield User_1.default.findOne({ _id: userId });
      const newQa = new Qa_1.default({
        question,
        answer,
        userId,
        toolId,
        importance,
      });
      yield newQa.save();
      const questionString = question.split(" ");
      (0, response_1.sendSuccess)(
        req,
        res,
        201,
        `Hola, ${user === null || user === void 0 ? void 0 : user.name}, now you question ${questionString
          .slice(0, 3)
          .join(" ")}... has been saved to your database 🤩`,
        { qa: newQa },
      );
    } catch (err) {
      next(err);
    }
  });
exports.createQa = createQa;
const getQa = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { userId, toolId } = req.params;
      const user = yield User_1.default.findOne({ _id: userId });
      const { page, limit, skip } = (0, response_1.getPagination)(req, 10);
      const filter = { userId, toolId };
      const totalDocuments = yield Qa_1.default.countDocuments(filter);
      const qaSet = yield Qa_1.default
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      (0, response_1.sendPaginated)(req, res, {
        message: `Hola, ${user === null || user === void 0 ? void 0 : user.name}, here is your saved QA set for this tool 🤩`,
        documents: qaSet,
        pageNumber: page,
        pageSize: limit,
        totalPages: (0, response_1.totalPages)(totalDocuments, limit),
        totalDocuments,
      });
    } catch (err) {
      next(err);
    }
  });
exports.getQa = getQa;
const updateQa = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { qaId, userId } = req.params;
      const user = yield User_1.default.findOne({ _id: userId });
      const updatedQa = yield Qa_1.default.findByIdAndUpdate(
        { _id: qaId },
        req.body,
        {
          new: true,
        },
      );
      (0, response_1.sendSuccess)(
        req,
        res,
        200,
        `Hola ${user === null || user === void 0 ? void 0 : user.name}, you have updated this QA`,
        {
          qa: updatedQa,
        },
      );
    } catch (err) {
      next(err);
    }
  });
exports.updateQa = updateQa;
const deleteQa = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { qaId, userId } = req.params;
      const user = yield User_1.default.findOne({ _id: userId });
      yield Qa_1.default.findByIdAndDelete({ _id: qaId });
      (0, response_1.sendSuccess)(
        req,
        res,
        200,
        `Hola ${user === null || user === void 0 ? void 0 : user.name}, you have deleted this QA`,
      );
    } catch (err) {
      next(err);
    }
  });
exports.deleteQa = deleteQa;
const generateAnswerWithAI = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { question } = req.body;
      if (typeof question !== "string" || !question.trim()) {
        (0, response_1.sendError)(req, res, 400, "Question is required");
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
                "You are an expert software engineer specializing in web development. Answer clearly and concisely. Return ONLY the answer text.",
            },
            {
              role: "user",
              content: question.trim(),
            },
          ],
          maxTokens: 300,
          temperature: 0.4,
        },
      );
    } catch (error) {
      if (!res.headersSent) {
        next(error);
      }
    }
  });
exports.generateAnswerWithAI = generateAnswerWithAI;
