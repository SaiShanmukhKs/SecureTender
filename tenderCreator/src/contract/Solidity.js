export const ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bidId",
        type: "uint256",
      },
    ],
    name: "approveBid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bidId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidderAddress",
        type: "address",
      },
    ],
    name: "BidPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bidId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum BlockchainTenderingSystem.BidStatus",
        name: "status",
        type: "uint8",
      },
    ],
    name: "BidStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bidderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rating",
        type: "uint256",
      },
    ],
    name: "BidderRated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bidderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidderAddress",
        type: "address",
      },
    ],
    name: "BidderRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
    ],
    name: "cancelTender",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
    ],
    name: "closeTender",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_rfp",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tenderFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_registrationFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_moneyDispersalPhases",
        type: "uint256",
      },
    ],
    name: "createTender",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
    ],
    name: "initiatePayment",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "phase",
        type: "uint256",
      },
    ],
    name: "PaymentReleased",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_bidDetails",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "placeBid",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bidId",
        type: "uint256",
      },
    ],
    name: "rejectBid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_phase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "releasePayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bidId",
        type: "uint256",
      },
    ],
    name: "setWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "createdBy",
        type: "address",
      },
    ],
    name: "TenderCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tenderCreatorId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tenderCreatorAddress",
        type: "address",
      },
    ],
    name: "TenderCreatorRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum BlockchainTenderingSystem.TenderStatus",
        name: "status",
        type: "uint8",
      },
    ],
    name: "TenderStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "txId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bidderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TransactionRecorded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bidId",
        type: "uint256",
      },
    ],
    name: "WinnerSelected",
    type: "event",
  },
  {
    inputs: [],
    name: "withdrawFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "addressToBidderId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "addressToTenderCreatorId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bidCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "bidderBids",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "bidderRatings",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveTenders",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bidId",
        type: "uint256",
      },
    ],
    name: "getBidDetails",
    outputs: [
      {
        internalType: "address",
        name: "bidderAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bidderId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "bidDetails",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "issueDate",
        type: "uint256",
      },
      {
        internalType: "enum BlockchainTenderingSystem.BidStatus",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
    ],
    name: "getTenderBids",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
    ],
    name: "getTenderDetails",
    outputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "rfp",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tenderFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "registrationFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "moneyDispersalPhases",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "createdBy",
        type: "address",
      },
      {
        internalType: "enum BlockchainTenderingSystem.TenderStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bidCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tenderId",
        type: "uint256",
      },
    ],
    name: "isTenderActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tenderBids",
    outputs: [
      {
        internalType: "uint256",
        name: "bidId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "bidderAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bidderId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "bidDetails",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "issueDate",
        type: "uint256",
      },
      {
        internalType: "enum BlockchainTenderingSystem.BidStatus",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tenderCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tenderCreatorTenders",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tenders",
    outputs: [
      {
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "rfp",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "startDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tenderFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "registrationFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "moneyDispersalPhases",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "createdBy",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tenderCreatorId",
        type: "uint256",
      },
      {
        internalType: "enum BlockchainTenderingSystem.TenderStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "winnerBidId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidCounter",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "transactionCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "transactions",
    outputs: [
      {
        internalType: "uint256",
        name: "txId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tenderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "enum BlockchainTenderingSystem.PaymentStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const ADDRESS = "0xd2cfBB143afB7d23EeaaD112aFe9BFDb4B6Ece77";
