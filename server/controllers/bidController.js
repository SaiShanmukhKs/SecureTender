import Bid from "../models/Bid.js";
import Tender from "../models/Tender.js";

export const submitBid = async (req, res) => {
  try {
    const { amount, notes } = req.body;
    const tenderId = req.params.tenderId;

    const tender = await Tender.findById(tenderId);
    if (!tender || tender.status !== "Open") {
      return res
        .status(400)
        .json({ message: "Tender is not open for bidding" });
    }

    const existingBid = await Bid.findOne({
      tender: tenderId,
      bidder: req.user._id,
    });

    if (existingBid) {
      return res
        .status(400)
        .json({ message: "You have already submitted a bid" });
    }

    const bid = await Bid.create({
      tender: tenderId,
      bidder: req.user._id,
      amount,
      notes,
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate("tender", "title description deadline status")
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findOne({
      _id: req.params.id,
      bidder: req.user._id,
    }).populate("tender");

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    res.status(200).json(bid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
