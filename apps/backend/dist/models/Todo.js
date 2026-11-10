"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const todoSchema = new mongoose_1.default.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urgency: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose_1.default.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
// Index to optimize sorting: pending first, nearest deadline first, then oldest first
todoSchema.index({ isCompleted: 1, deadline: 1 });
// Model-level default sorting: pending first (isCompleted: 1), nearest deadline first (deadline: 1), then oldest first (createdAt: 1)
todoSchema.pre(/^find/, function () {
  if (!this.getOptions().sort) {
    this.sort({ isCompleted: 1, deadline: 1 });
  }
});
const Todo =
  mongoose_1.default.models.Todo ||
  mongoose_1.default.model("Todo", todoSchema);
exports.default = Todo;
