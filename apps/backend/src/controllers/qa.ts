import { NextFunction, Request, Response } from "express";
import Qa from "../models/Qa";
import User from "../models/User";
import dotenv from "dotenv";
import {
  getPagination,
  sendError,
  sendPaginated,
  sendSuccess,
  totalPages,
} from "../helpers/response";
import { streamOpenRouterCompletion } from "../helpers/streamOpenRouterCompletion";

dotenv.config();

export const createQa = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { question, answer, userId, toolId, importance } = req.body;

    const user = await User.findOne({ _id: userId });

    const newQa = new Qa({
      question,
      answer,
      userId,
      toolId,
      importance,
    });

    await newQa.save();

    const questionString = question.split(" ");

    sendSuccess(
      req,
      res,
      201,
      `Hola, ${user?.name}, now you question ${questionString
        .slice(0, 3)
        .join(" ")}... has been saved to your database 🤩`,
      { qa: newQa },
    );
  } catch (err: any) {
    next(err);
  }
};

export const getQa = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, toolId } = req.params;
    const user = await User.findOne({ _id: userId });
    const { page, limit, skip } = getPagination(req, 10);
    const filter = { userId, toolId };
    const totalDocuments = await Qa.countDocuments(filter);
    const qaSet = await Qa.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    sendPaginated(req, res, {
      message: `Hola, ${user?.name}, here is your saved QA set for this tool 🤩`,
      documents: qaSet,
      pageNumber: page,
      pageSize: limit,
      totalPages: totalPages(totalDocuments, limit),
      totalDocuments,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateQa = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { qaId, userId } = req.params;
    const user = await User.findOne({ _id: userId });
    const updatedQa = await Qa.findByIdAndUpdate({ _id: qaId }, req.body, {
      new: true,
    });
    sendSuccess(req, res, 200, `Hola ${user?.name}, you have updated this QA`, {
      qa: updatedQa,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteQa = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { qaId, userId } = req.params;
    const user = await User.findOne({ _id: userId });
    await Qa.findByIdAndDelete({ _id: qaId });
    sendSuccess(req, res, 200, `Hola ${user?.name}, you have deleted this QA`);
  } catch (err: any) {
    next(err);
  }
};

export const generateAnswerWithAI = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      sendError(req, res, 400, "Question is required");
      return;
    }

    await streamOpenRouterCompletion(req, res, {
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
    });
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    }
  }
};
