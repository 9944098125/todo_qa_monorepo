import mongoose from "mongoose";

const qaSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
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
qaSchema.pre(/^find/, function (this: any) {
  if (!this.getOptions().sort) {
    this.sort({ createdAt: 1 });
  }
});

const Qa = mongoose.models.Qa || mongoose.model("Qa", qaSchema);

export default Qa;
