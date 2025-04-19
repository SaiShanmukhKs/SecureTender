import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    tender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tender",
      required: true,
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Submitted", "Shortlisted", "Awarded", "Rejected"],
      default: "Submitted",
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Bid", bidSchema);
