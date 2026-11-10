import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Index to optimize sorting: pending first, nearest deadline first, then oldest first
todoSchema.index({ isCompleted: 1, deadline: 1 });

// Model-level default sorting: pending first (isCompleted: 1), nearest deadline first (deadline: 1), then oldest first (createdAt: 1)
todoSchema.pre(/^find/, function (this: any) {
  if (!this.getOptions().sort) {
    this.sort({ isCompleted: 1, deadline: 1 });
  }
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
