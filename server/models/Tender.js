import mongoose from "mongoose";

const tenderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Awarded"],
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    estimatedBudget: String,
    category: String,
    documents: [String],
    awardedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tender", tenderSchema);
