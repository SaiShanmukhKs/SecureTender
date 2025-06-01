export const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tenderId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "phase",
				"type": "uint256"
			}
		],
		"name": "FundsDispersed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tenderId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tenderId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RegistrationFeePaid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tenderId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "WinnerSelected",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "bidCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bids",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "bidId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tenderId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "createdBy",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "detailsFile",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "issueDate",
				"type": "uint256"
			},
			{
				"internalType": "enum BlockchainTendering.BidStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bidsByBidder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			}
		],
		"name": "canDisperseFunds",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "rfp",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tenderFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "registrationFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "phases",
				"type": "uint256"
			}
		],
		"name": "createTender",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			}
		],
		"name": "disperseFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getActiveTenders",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tenderId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "rfp",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tenderFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "registrationFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "moneyDispersalPhases",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "createdBy",
						"type": "address"
					},
					{
						"internalType": "enum BlockchainTendering.TenderStatus",
						"name": "tenderStatus",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "winner",
						"type": "address"
					},
					{
						"internalType": "uint256[]",
						"name": "bidIds",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256[]",
						"name": "transactionIds",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "totalAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "dispersedAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "phasesCompleted",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "fundsDeposited",
						"type": "bool"
					}
				],
				"internalType": "struct BlockchainTendering.Tender[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tenderCreator",
				"type": "address"
			}
		],
		"name": "getAwardedTenders",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tenderId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "rfp",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tenderFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "registrationFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "moneyDispersalPhases",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "createdBy",
						"type": "address"
					},
					{
						"internalType": "enum BlockchainTendering.TenderStatus",
						"name": "tenderStatus",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "winner",
						"type": "address"
					},
					{
						"internalType": "uint256[]",
						"name": "bidIds",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256[]",
						"name": "transactionIds",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "totalAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "dispersedAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "phasesCompleted",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "fundsDeposited",
						"type": "bool"
					}
				],
				"internalType": "struct BlockchainTendering.Tender[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_bidder",
				"type": "address"
			}
		],
		"name": "getBidsByBidder",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "bidId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tenderId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "createdBy",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "detailsFile",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "issueDate",
						"type": "uint256"
					},
					{
						"internalType": "enum BlockchainTendering.BidStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct BlockchainTendering.Bid[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			}
		],
		"name": "getBidsForTender",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "bidId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tenderId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "createdBy",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "detailsFile",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "issueDate",
						"type": "uint256"
					},
					{
						"internalType": "enum BlockchainTendering.BidStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct BlockchainTendering.Bid[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			}
		],
		"name": "getPhaseInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalPhases",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "completedPhases",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "remainingPhases",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dispersedAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "remainingAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountPerPhase",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "fundsDeposited",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			}
		],
		"name": "getRegistrationFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			}
		],
		"name": "getRegistrationFeesCollected",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			}
		],
		"name": "getRemainingPhases",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			}
		],
		"name": "getTenderDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tenderId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "rfp",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tenderFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "registrationFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "moneyDispersalPhases",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "createdBy",
						"type": "address"
					},
					{
						"internalType": "enum BlockchainTendering.TenderStatus",
						"name": "tenderStatus",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "winner",
						"type": "address"
					},
					{
						"internalType": "uint256[]",
						"name": "bidIds",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256[]",
						"name": "transactionIds",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "totalAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "dispersedAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "phasesCompleted",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "fundsDeposited",
						"type": "bool"
					}
				],
				"internalType": "struct BlockchainTendering.Tender",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_creator",
				"type": "address"
			}
		],
		"name": "getTendersByCreator",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tenderId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "rfp",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tenderFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "registrationFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "moneyDispersalPhases",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "createdBy",
						"type": "address"
					},
					{
						"internalType": "enum BlockchainTendering.TenderStatus",
						"name": "tenderStatus",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "winner",
						"type": "address"
					},
					{
						"internalType": "uint256[]",
						"name": "bidIds",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256[]",
						"name": "transactionIds",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "totalAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "dispersedAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "phasesCompleted",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "fundsDeposited",
						"type": "bool"
					}
				],
				"internalType": "struct BlockchainTendering.Tender[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			}
		],
		"name": "getTransactionsForTender",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "txId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tenderId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "bidder",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					}
				],
				"internalType": "struct BlockchainTendering.Transaction[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tenderId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "bidder",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					}
				],
				"internalType": "struct BlockchainTendering.TransactionInput",
				"name": "input",
				"type": "tuple"
			}
		],
		"name": "logTransactionPublic",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_detailsFile",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "placeBid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_bidId",
				"type": "uint256"
			},
			{
				"internalType": "enum BlockchainTendering.BidStatus",
				"name": "_status",
				"type": "uint8"
			}
		],
		"name": "setBidStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_winner",
				"type": "address"
			}
		],
		"name": "setWinner",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tenderCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tenders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tenderId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "rfp",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tenderFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "registrationFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "moneyDispersalPhases",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "createdBy",
				"type": "address"
			},
			{
				"internalType": "enum BlockchainTendering.TenderStatus",
				"name": "tenderStatus",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dispersedAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "phasesCompleted",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "fundsDeposited",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tendersByCreator",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "transactions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "txId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tenderId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "txCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tenderId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_newStatus",
				"type": "uint256"
			}
		],
		"name": "updateStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

export const ADDRESS = "0x4ba401456B4B23571eBD331CD4591a569f21a625";
