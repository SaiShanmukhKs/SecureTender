import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectToDb from "./utils/connectToDb.js";
import bidderRoutes from "./routes/bidderRoute.js";
import tenderCreatorRoutes from "./routes/tenderCreatorRoute.js";
import { loginUser, registerUser } from "./routes/userController.js";
import TenderCreator from "./models/tenderCreatorSchema.js";
import Bidder from "./models/bidderSchema.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToDb();

app.use("/api/bidder", bidderRoutes);
app.use("/api/tender-creator", tenderCreatorRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post("/api/register", (req, res) => {
  const { name, email, password, role, walletAddress, companyName } = req.body;
  console.log("Registering user with data:", req.body);

  if (!name || !email || !password || !walletAddress || !companyName) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (role !== "bidder" && role !== "tenderCreator") {
    return res.status(400).json({ error: "Invalid role" });
  } else if (role === "tenderCreator") {
    registerUser(TenderCreator, req, res);
  } else {
    registerUser(Bidder, req, res);
  }
});

app.post("/api/login", (req, res) => {
  const { email, password, role } = req.body;
  console.log("Logging in user with data:", req.body);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (role === "tenderCreator") {
    loginUser(TenderCreator, "tenderCreator", req, res);
  } else if (role === "bidder") {
    loginUser(Bidder, "bidder", req, res);
  } else {
    return res.status(400).json({ error: "Invalid role" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
