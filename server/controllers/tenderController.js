import Tender from "../models/Tender.js";
import Bid from "../models/Bid.js";

export const getAllTenders = async (req, res) => {
  try {
    const { status, category, keyword } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = new RegExp(category, "i");
    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, "i") },
        { description: new RegExp(keyword, "i") },
      ];
    }

    const tenders = await Tender.find(query)
      .populate("createdBy", "name companyName")
      .sort({ createdAt: -1 });

    res.status(200).json(tenders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id)
      .populate("createdBy", "name companyName")
      .populate("awardedTo");

    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }

    const bids = await Bid.find({ tender: tender._id }).populate(
      "bidder",
      "name companyName rating"
    );

    res.status(200).json({ tender, bids });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createTender = async (req, res) => {
  try {
    const tenderData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const tender = await Tender.create(tenderData);
    res.status(201).json(tender);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTender = async (req, res) => {
  try {
    const tender = await Tender.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }

    Object.assign(tender, req.body);
    await tender.save();

    res.status(200).json(tender);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const awardTender = async (req, res) => {
  try {
    const { bidId } = req.body;
    const tender = await Tender.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    tender.status = "Awarded";
    tender.awardedTo = bidId;
    await tender.save();

    bid.status = "Awarded";
    await bid.save();

    // Reject other bids
    await Bid.updateMany(
      { tender: tender._id, _id: { $ne: bidId } },
      { status: "Rejected" }
    );

    res.status(200).json({ message: "Tender awarded successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
