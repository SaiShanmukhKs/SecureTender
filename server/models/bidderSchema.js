import mongoose from "mongoose";
import bcrypt from "bcrypt";

const bidderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    bidsPlaced: {
      type: Number,
      default: 0,
    },
    bidsWon: {
      type: Number,
      default: 0,
    },
    tendersCompeted: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: -1,
    },
  },
  { timestamps: true }
);

bidderSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

bidderSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Bidder = mongoose.model("Bidder", bidderSchema);
export default Bidder;
