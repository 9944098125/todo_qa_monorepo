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
exports.deleteTool =
  exports.updateTool =
  exports.getToolById =
  exports.getTools =
  exports.createTool =
    void 0;
const Tool_1 = __importDefault(require("../models/Tool"));
const response_1 = require("../helpers/response");
/**
 * Create Tool
 */
const createTool = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { userId, name, slug, image, color, description } = req.body;
      const existingTool = yield Tool_1.default.findOne({
        userId,
        slug: slug.trim().toLowerCase(),
      });
      if (existingTool) {
        res.status(409).json({
          success: false,
          message: "Tool already exists.",
        });
        return;
      }
      const tool = yield Tool_1.default.create({
        userId,
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        image,
        color,
        description,
      });
      (0, response_1.sendSuccess)(req, res, 201, "Tool created successfully.", {
        tool,
      });
    } catch (err) {
      next(err);
    }
  });
exports.createTool = createTool;
/**
 * Get All Tools
 */
const getTools = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { userId } = req.query;
      const tools = yield Tool_1.default
        .find({
          userId,
        })
        .sort({
          slug: 1,
        });
      (0, response_1.sendSuccess)(
        req,
        res,
        200,
        "Tools fetched successfully.",
        {
          tools,
        },
      );
    } catch (err) {
      next(err);
    }
  });
exports.getTools = getTools;
/**
 * Get Tool By Id
 */
const getToolById = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { userId, toolId } = req.query;
      const tool = yield Tool_1.default.findOne({
        _id: toolId,
        userId,
      });
      if (!tool) {
        res.status(404).json({
          success: false,
          message: "Tool not found.",
        });
        return;
      }
      (0, response_1.sendSuccess)(req, res, 200, "Tool fetched successfully.", {
        tool,
      });
    } catch (err) {
      next(err);
    }
  });
exports.getToolById = getToolById;
/**
 * Update Tool
 */
const updateTool = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { toolId, userId } = req.query;
      const updatedTool = yield Tool_1.default.findOneAndUpdate(
        {
          _id: toolId,
          userId,
        },
        req.body,
        {
          new: true,
        },
      );
      if (!updatedTool) {
        res.status(404).json({
          success: false,
          message: "Tool not found.",
        });
        return;
      }
      (0, response_1.sendSuccess)(req, res, 200, "Tool updated successfully.", {
        tool: updatedTool,
      });
    } catch (err) {
      next(err);
    }
  });
exports.updateTool = updateTool;
/**
 * Delete Tool
 */
const deleteTool = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { userId, toolId } = req.query;
      const deletedTool = yield Tool_1.default.findOneAndDelete({
        _id: toolId,
        userId,
      });
      if (!deletedTool) {
        res.status(404).json({
          success: false,
          message: "Tool not found.",
        });
        return;
      }
      (0, response_1.sendSuccess)(req, res, 200, "Tool deleted successfully.");
    } catch (err) {
      next(err);
    }
  });
exports.deleteTool = deleteTool;
