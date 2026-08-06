import { Schema, model, models } from "mongoose";

const toolSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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

const Tool = models.Tool || model("Tool", toolSchema);

export default Tool;
