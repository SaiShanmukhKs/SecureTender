// routes/tenderCreatorRoute.js
import express from "express";
import TenderCreator from "../models/tenderCreatorSchema.js";
import authenticateToken from "../middleware/authenticateToken.js";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteProfile,
} from "./userController.js";

const router = express.Router();

router.post("/register", (req, res) => registerUser(TenderCreator, req, res));
router.post("/login", (req, res) =>
  loginUser(TenderCreator, "tenderCreator", req, res)
);
router.get("/profile", authenticateToken, (req, res) =>
  getProfile(TenderCreator, req, res)
);
router.put("/profile", authenticateToken, (req, res) =>
  updateProfile(TenderCreator, req, res)
);
router.delete("/profile", authenticateToken, (req, res) =>
  deleteProfile(TenderCreator, req, res)
);

// Rate a bidder
router.post("/rate/:bidderId", authenticateToken, async (req, res) => {
  const { rating } = req.body;
  const { bidderId } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const bidder = await Bidder.findById(bidderId);
    if (!bidder) {
      return res.status(404).json({ error: "Bidder not found" });
    }

    bidder.ratings = bidder.ratings || [];
    bidder.ratings.push({ value: rating, by: req.user.id });
    await bidder.save();

    res.status(200).json({ message: "Bidder rated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
