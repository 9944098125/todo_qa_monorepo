import { NextFunction, Request, Response } from "express";
import Todo from "../models/Todo";
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
// open ai api key

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, urgency, deadline, userId, isCompleted } =
      req.body;
    const user = await User.findOne({ _id: userId });
    const newTodo = new Todo({
      title,
      description,
      urgency,
      deadline,
      userId,
      isCompleted: typeof isCompleted === "boolean" ? isCompleted : false,
    });
    await newTodo.save();
    sendSuccess(
      req,
      res,
      201,
      `Hola ${user?.name}, you have created a new todo ${newTodo.title} 🤩`,
      { todo: newTodo },
    );
  } catch (err: any) {
    next(err);
  }
};

export const getTodoWithUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    const { page, limit, skip } = getPagination(req, 10);
    const filterParam = (req.query.filter as string)?.toLowerCase() || "all";

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

    const query: any = { userId };

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

    const totalDocuments = await Todo.countDocuments(query);
    const todoList = await Todo.find(query)
      .sort({ isCompleted: 1, deadline: 1 })
      .skip(skip)
      .limit(limit);

    sendPaginated(req, res, {
      message: `Hola ${user?.name}, here is your todo list 🤩`,
      documents: todoList,
      pageNumber: page,
      pageSize: limit,
      totalPages: totalPages(totalDocuments, limit),
      totalDocuments,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { todoId } = req.params;
    const { title, description, urgency, deadline, userId, isCompleted } =
      req.body;
    const user = await User.findOne({ _id: userId });

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (urgency !== undefined) updateData.urgency = urgency;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (userId !== undefined) updateData.userId = userId;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    const updatedTodo = await Todo.findByIdAndUpdate(todoId, updateData, {
      new: true,
    });
    sendSuccess(
      req,
      res,
      200,
      `Hola ${user?.name}, you have updated the todo ${updatedTodo?.title} successfully 🤩`,
      { todo: updatedTodo },
    );
  } catch (err: any) {
    next(err);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { todoId } = req.params;
    const user = await User.findOne({ _id: req.params.userId });
    await Todo.findByIdAndDelete(todoId);
    sendSuccess(
      req,
      res,
      200,
      `Hola ${user?.name}, you have deleted the todo successfully 🤩`,
    );
  } catch (err: any) {
    next(err);
  }
};

export const generateTodoDescription = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { todoTitle } = req.body;

    if (typeof todoTitle !== "string" || !todoTitle.trim()) {
      sendError(req, res, 400, "Todo title is required");
      return;
    }

    await streamOpenRouterCompletion(req, res, {
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
    });
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    }
  }
};
