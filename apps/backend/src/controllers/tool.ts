import { NextFunction, Request, Response } from "express";
import Tool from "../models/Tool";
import { sendSuccess } from "../helpers/response";

/**
 * Create Tool
 */
export const createTool = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, name, slug, image, color, description } = req.body;

    const existingTool = await Tool.findOne({
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

    const tool = await Tool.create({
      userId,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      image,
      color,
      description,
    });

    sendSuccess(req, res, 201, "Tool created successfully.", {
      tool,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get All Tools
 */
export const getTools = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.query;

    const tools = await Tool.find({
      userId,
    }).sort({
      slug: 1,
    });

    sendSuccess(req, res, 200, "Tools fetched successfully.", {
      tools,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Tool By Id
 */
export const getToolById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, toolId } = req.query;

    const tool = await Tool.findOne({
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

    sendSuccess(req, res, 200, "Tool fetched successfully.", {
      tool,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Tool
 */
export const updateTool = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { toolId, userId } = req.query;

    const updatedTool = await Tool.findOneAndUpdate(
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

    sendSuccess(req, res, 200, "Tool updated successfully.", {
      tool: updatedTool,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete Tool
 */
export const deleteTool = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, toolId } = req.query;

    const deletedTool = await Tool.findOneAndDelete({
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

    sendSuccess(req, res, 200, "Tool deleted successfully.");
  } catch (err) {
    next(err);
  }
};
