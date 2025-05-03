import mongoose from "mongoose";
import bcrypt from "bcrypt";

const tenderCreatorSchema = new mongoose.Schema(
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
    tendersCreated: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

tenderCreatorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

tenderCreatorSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const TenderCreator = mongoose.model("TenderCreator", tenderCreatorSchema);
export default TenderCreator;
