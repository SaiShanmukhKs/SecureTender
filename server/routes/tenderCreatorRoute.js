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
import Bidder from "../models/bidderSchema.js";

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) =>
  getProfile(TenderCreator, req, res)
);
router.put("/profile", authenticateToken, (req, res) =>
  updateProfile(TenderCreator, req, res)
);
router.delete("/profile", authenticateToken, (req, res) =>
  deleteProfile(TenderCreator, req, res)
);

// Get Bidder Details by Wallet Address
router.get("/bidderDetails", authenticateToken, async (req, res) => {
  const { address } = req.query;
  console.log("Address:", address);

  if (!address) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    const bidder = await Bidder.findOne({ walletAddress: address });

    if (!bidder) {
      console.log("Bidder not found for address:", address);
      return res.status(404).json({ error: "Bidder not found" });
    }

    res.status(200).json({
      id: bidder._id, // Include the bidder ID for rating
      name: bidder.name,
      rating: bidder.rating || 0,
      tendersCompeted: bidder.tendersCompeted || 0
    });
  } catch (err) {
    console.error("Error fetching bidder details:", err);
    res.status(500).json({ error: err.message });
  }
});

// CORRECTED: Rate a bidder by wallet address (matches frontend call)
router.put("/rateBidder", authenticateToken, async (req, res) => {
  const { bidderAddress, rating } = req.body;

  // Validation
  if (!bidderAddress) {
    return res.status(400).json({ error: "Bidder address is required" });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    // Find bidder by wallet address
    const bidder = await Bidder.findOne({ walletAddress: bidderAddress });
    
    if (!bidder) {
      return res.status(404).json({ error: "Bidder not found" });
    }

    // Check if this tender creator has already rated this bidder
    const existingRating = bidder.ratings?.find(
      r => r.by.toString() === req.user.id
    );

    if (existingRating) {
      return res.status(400).json({ error: "You have already rated this bidder" });
    }

    // Initialize ratings array if it doesn't exist
    if (!bidder.ratings) {
      bidder.ratings = [];
    }

    // Add the new rating
    bidder.ratings.push({
      value: rating,
      by: req.user.id,
      createdAt: new Date()
    });

    // Calculate new average rating
    const totalRatings = bidder.ratings.length;
    const sumRatings = bidder.ratings.reduce((sum, r) => sum + r.value, 0);
    bidder.rating = sumRatings / totalRatings;

    // Increment tenders competed (assuming this is called after tender completion)
    bidder.tendersCompeted = (bidder.tendersCompeted || 0) + 1;

    await bidder.save();

    res.status(200).json({ 
      message: "Bidder rated successfully",
      newRating: bidder.rating,
      totalRatings: totalRatings
    });

  } catch (err) {
    console.error("Error rating bidder:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update tender count
router.put("/update-tendercount", authenticateToken, async (req, res) => {
  try {
    console.log("Req", req.body.userId);
    const tenderCreator = await TenderCreator.findById(req.body.userId);
    if (!tenderCreator) {
      return res.status(404).json({ error: "Tender Creator not found" });
    }

    tenderCreator.tendersCreated = (tenderCreator.tendersCreated || 0) + 1;
    await tenderCreator.save();

    res.status(200).json({ message: "Tender count updated successfully" });
  } catch (err) {
    console.error("Error updating tender count:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;