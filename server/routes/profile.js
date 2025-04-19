import express from "express";
import { protect } from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.use(protect);
router.get("/", getProfile);
router.patch("/", updateProfile);

export default router;
