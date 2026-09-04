"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const toolSchema = new mongoose_1.Schema(
  {
    userId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#000000",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
const Tool =
  mongoose_1.models.Tool || (0, mongoose_1.model)("Tool", toolSchema);
exports.default = Tool;
