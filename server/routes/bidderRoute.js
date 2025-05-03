// routes/bidderRoute.js
import express from "express";
import Bidder from "../models/bidderSchema.js";
import authenticateToken from "../middleware/authenticateToken.js";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteProfile,
} from "./userController.js";

const router = express.Router();

router.post("/register", (req, res) => registerUser(Bidder, req, res));
router.post("/login", (req, res) => loginUser(Bidder, "bidder", req, res));
router.get("/profile", authenticateToken, (req, res) =>
  getProfile(Bidder, req, res)
);
router.put("/profile", authenticateToken, (req, res) =>
  updateProfile(Bidder, req, res)
);
router.delete("/profile", authenticateToken, (req, res) =>
  deleteProfile(Bidder, req, res)
);

export default router;
