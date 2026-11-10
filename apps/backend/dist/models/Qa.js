"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const qaSchema = new mongoose_1.default.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    importance: {
      type: String,
      enum: ["Important", "Very Important", "Not Important"],
      default: "Not Important",
    },
    userId: {
      type: mongoose_1.default.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toolId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
// Index to optimize sorting by creation time
qaSchema.index({ createdAt: 1 });
// Model-level default sorting: first created stays first (ascending order)
qaSchema.pre(/^find/, function () {
  if (!this.getOptions().sort) {
    this.sort({ createdAt: 1 });
  }
});
const Qa =
  mongoose_1.default.models.Qa || mongoose_1.default.model("Qa", qaSchema);
exports.default = Qa;
