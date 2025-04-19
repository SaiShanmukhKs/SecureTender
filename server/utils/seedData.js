import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Tender from "../models/Tender.js";
import Bid from "../models/Bid.js";
import connectDB from "../config/database.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Tender.deleteMany();
    await Bid.deleteMany();

    // Create users
    const creator = await User.create({
      name: "John Doe",
      email: "creator@example.com",
      password: "password123",
      role: "creator",
      companyName: "Government Department",
      registrationNumber: "CREATOR-001",
    });

    const bidder1 = await User.create({
      name: "TechSolutions Inc.",
      email: "bidder1@example.com",
      password: "password123",
      role: "bidder",
      companyName: "TechSolutions Inc.",
      rating: 4.7,
      categories: ["IT Services", "Hardware", "Consultancy"],
      registrationNumber: "BIDDER-001",
    });

    const bidder2 = await User.create({
      name: "OfficeMax Inc.",
      email: "bidder2@example.com",
      password: "password123",
      role: "bidder",
      companyName: "OfficeMax Inc.",
      rating: 4.5,
      categories: ["Office Supplies", "Furniture"],
      registrationNumber: "BIDDER-002",
    });

    // Create tenders
    const tender1 = await Tender.create({
      title: "Office Supplies Procurement",
      description: "Supply of stationery and office consumables for Q1 2025",
      deadline: new Date("2025-03-15"),
      status: "Open",
      createdBy: creator._id,
      estimatedBudget: "10,000 - 15,000",
      category: "Supplies",
      documents: ["tender_specs.pdf", "terms_conditions.pdf"],
    });

    const tender2 = await Tender.create({
      title: "IT Hardware Maintenance",
      description: "Annual maintenance contract for server infrastructure",
      deadline: new Date("2025-03-10"),
      status: "Open",
      createdBy: creator._id,
      estimatedBudget: "40,000 - 50,000",
      category: "Services",
      documents: ["maintenance_requirements.pdf", "sla_template.pdf"],
    });

    // Create bids
    await Bid.create({
      tender: tender1._id,
      bidder: bidder1._id,
      amount: 12500,
      status: "Submitted",
      notes: "Included 5% discount on bulk orders",
    });

    await Bid.create({
      tender: tender1._id,
      bidder: bidder2._id,
      amount: 13800,
      status: "Submitted",
      notes: "Premium quality products",
    });

    await Bid.create({
      tender: tender2._id,
      bidder: bidder1._id,
      amount: 45000,
      status: "Shortlisted",
      notes: "24/7 support included in pricing",
    });

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
