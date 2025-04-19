import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  getAllTenders,
  getTenderById,
  createTender,
  updateTender,
  awardTender,
} from "../controllers/tenderController.js";

const router = express.Router();

router.get("/", getAllTenders);
router.get("/:id", getTenderById);

// Protected routes for creators
router.use(protect);
router.post("/", restrictTo("creator"), createTender);
router.patch("/:id", restrictTo("creator"), updateTender);
router.post("/:id/award", restrictTo("creator"), awardTender);

export default router;
