// bidder-backend.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const tenders = [
  {
    id: 1,
    title: "Office Supplies Procurement",
    description: "Supply of stationery and office consumables for Q1 2025",
    deadline: "2025-03-15",
    status: "Open",
    createdBy: "Ministry of Education",
    estimatedBudget: "10,000 - 15,000",
    category: "Supplies",
    documents: ["tender_specs.pdf", "terms_conditions.pdf"],
  },
  {
    id: 2,
    title: "IT Hardware Maintenance",
    description: "Annual maintenance contract for server infrastructure",
    deadline: "2025-03-10",
    status: "Open",
    createdBy: "Department of Health",
    estimatedBudget: "40,000 - 50,000",
    category: "Services",
    documents: ["maintenance_requirements.pdf", "sla_template.pdf"],
  },
  {
    id: 3,
    title: "Cafeteria Services",
    description: "Providing cafeteria services for 100 employees",
    deadline: "2025-02-28",
    status: "Closed",
    createdBy: "City Council",
    estimatedBudget: "30,000 - 40,000",
    category: "Food Services",
    documents: ["cafeteria_requirements.pdf"],
  },
];

// Bidder profile
const bidderProfile = {
  id: 1001,
  name: "TechSolutions Inc.",
  email: "contact@techsolutions.example",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, Tech City, TC 54321",
  registrationNumber: "BID-2025-1001",
  rating: 4.7,
  categories: ["IT Services", "Hardware", "Consultancy"],
  documents: ["company_profile.pdf", "tax_certificate.pdf", "registration.pdf"],
};

// Bids submitted by the current bidder
let myBids = [
  {
    id: 101,
    tenderId: 1,
    tenderTitle: "Office Supplies Procurement",
    bidAmount: 12500,
    submissionDate: "2025-02-25",
    status: "Submitted",
    notes: "Included 5% discount on bulk orders",
  },
  {
    id: 102,
    tenderId: 2,
    tenderTitle: "IT Hardware Maintenance",
    bidAmount: 45000,
    submissionDate: "2025-02-20",
    status: "Shortlisted",
    notes: "24/7 support included in pricing",
  },
  {
    id: 103,
    tenderId: 3,
    tenderTitle: "Cafeteria Services",
    bidAmount: 35000,
    submissionDate: "2025-02-15",
    status: "Awarded",
    notes: "Organic food options included",
  },
];

// Simple authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // For demo purposes, we'll accept any token
  // In a real app, you would verify the token
  next();
};

// Routes

// Get all tenders
app.get("/tenders", (req, res) => {
  res.json(tenders);
});

// Get tender by ID
app.get("/tenders/:id", (req, res) => {
  const tender = tenders.find((t) => t.id === parseInt(req.params.id));

  if (!tender) {
    return res.status(404).json({ message: "Tender not found" });
  }

  res.json(tender);
});

// Search tenders
app.get("/tenders/search", (req, res) => {
  let filteredTenders = [...tenders];

  // Filter by status
  if (req.query.status) {
    filteredTenders = filteredTenders.filter(
      (t) => t.status.toLowerCase() === req.query.status.toLowerCase()
    );
  }

  // Filter by category
  if (req.query.category) {
    filteredTenders = filteredTenders.filter((t) =>
      t.category.toLowerCase().includes(req.query.category.toLowerCase())
    );
  }

  // Filter by title or description
  if (req.query.keyword) {
    filteredTenders = filteredTenders.filter(
      (t) =>
        t.title.toLowerCase().includes(req.query.keyword.toLowerCase()) ||
        t.description.toLowerCase().includes(req.query.keyword.toLowerCase())
    );
  }

  res.json(filteredTenders);
});

// Get bidder profile
app.get("/bidder/profile", authenticateToken, (req, res) => {
  res.json(bidderProfile);
});

// Update bidder profile
app.put("/bidder/profile", authenticateToken, (req, res) => {
  const updates = req.body;

  // Update only allowed fields
  const allowedUpdates = ["name", "email", "phone", "address", "categories"];

  Object.keys(updates).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      bidderProfile[key] = updates[key];
    }
  });

  res.json(bidderProfile);
});

// Get bidder's bids
app.get("/bidder/bids", authenticateToken, (req, res) => {
  res.json(myBids);
});

// Submit a new bid
app.post("/bidder/bids", authenticateToken, (req, res) => {
  const { tenderId, bidAmount, notes } = req.body;

  // Validate input
  if (!tenderId || !bidAmount) {
    return res
      .status(400)
      .json({ message: "Tender ID and bid amount are required" });
  }

  // Check if tender exists
  const tender = tenders.find((t) => t.id === parseInt(tenderId));
  if (!tender) {
    return res.status(404).json({ message: "Tender not found" });
  }

  // Create new bid
  const newBid = {
    id: Math.floor(Math.random() * 1000) + 200,
    tenderId: parseInt(tenderId),
    tenderTitle: tender.title,
    bidAmount: parseFloat(bidAmount),
    submissionDate: new Date().toISOString().split("T")[0],
    status: "Submitted",
    notes: notes || "",
  };

  // Add bid to list
  myBids.push(newBid);

  res.status(201).json(newBid);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
