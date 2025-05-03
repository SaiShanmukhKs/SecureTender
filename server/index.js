import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectToDb from "./utils/connectToDb.js";
import bidderRoutes from "./routes/bidderRoute.js";
import tenderCreatorRoutes from "./routes/tenderCreatorRoute.js";

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
