import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  submitBid,
  getMyBids,
  getBidById,
} from "../controllers/bidController.js";

const router = express.Router();

// Protected routes for bidders
router.use(protect);
router.use(restrictTo("bidder"));

router.post("/:tenderId", submitBid);
router.get("/", getMyBids);
router.get("/:id", getBidById);

export default router;
