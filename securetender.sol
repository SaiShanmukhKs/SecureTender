// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockchainTendering {
    uint public tenderCount;
    uint public bidCount;
    uint public txCount;

    enum BidStatus { Pending, Accepted, Rejected }
    enum TenderStatus {Closed, Open, Cancelled}

    struct Transaction {
        uint txId;
        uint tenderId;
        address bidder;
        uint amount;
        uint timestamp;
        string status;
    }

    struct Bid {
        uint bidId;
        uint tenderId;
        address createdBy;
        string detailsFile;
        uint amount;
        uint issueDate;
        BidStatus status;
    }

    struct Tender {
        uint tenderId;
        string title;
        string rfp;
        uint startDate;
        uint endDate;
        uint tenderFee;
        uint registrationFee;
        uint moneyDispersalPhases;
        address createdBy;
        TenderStatus tenderStatus;
        address winner;
        uint[] bidIds;
        uint[] transactionIds;
    }

    struct TransactionInput {
        uint tenderId;
        address bidder;
        uint amount;
        string status;
    }

    mapping(uint => Tender) public tenders;
    mapping(uint => Bid) public bids;
    mapping(uint => Transaction) public transactions;

    mapping(address => uint[]) public tendersByCreator;
    mapping(address => uint[]) public bidsByBidder;

    // ============ MODIFIERS ============

    modifier validTender(uint _tenderId) {
        require(tenders[_tenderId].tenderId != 0, "Tender does not exist");
        _;
    }

    modifier validBid(uint _bidId) {
        require(bids[_bidId].bidId != 0, "Bid does not exist");
        _;
    }

    modifier onlyCreator(uint _tenderId) {
        require(tenders[_tenderId].createdBy == msg.sender, "Only tender creator allowed");
        _;
    }

    modifier onlyWinner(uint _tenderId) {
        require(tenders[_tenderId].winner == msg.sender, "Only winner allowed");
        _;
    }

    // ============ FUNCTIONS ============

    function createTender(string memory title, string memory rfp, uint startDate, uint endDate, uint tenderFee, uint registrationFee, uint phases) public {
        tenderCount++;
        Tender storage t = tenders[tenderCount];
        t.tenderId = tenderCount;
        t.title = title;
        t.rfp = rfp;
        t.startDate = startDate;
        t.endDate = endDate;
        t.tenderFee = tenderFee;
        t.registrationFee = registrationFee;
        t.moneyDispersalPhases = phases;
        t.createdBy = msg.sender;
        t.tenderStatus = TenderStatus.Open;

        tendersByCreator[msg.sender].push(tenderCount);
    }

    function getActiveTenders() external view returns (Tender[] memory) {
        uint activeCount = 0;
        
        // Count active tenders
        for(uint i = 1; i <= tenderCount; i++) {
            if(tenders[i].tenderStatus == TenderStatus.Open && 
               block.timestamp >= tenders[i].startDate && 
               block.timestamp <= tenders[i].endDate) {
                activeCount++;
            }
        }
        
        // Create result array
        Tender[] memory activeTenders = new Tender[](activeCount);
        uint currentIndex = 0;
        
        // Fill result array
        for(uint i = 1; i <= tenderCount; i++) {
            if(tenders[i].tenderStatus == TenderStatus.Open && 
               block.timestamp >= tenders[i].startDate && 
               block.timestamp <= tenders[i].endDate) {
                activeTenders[currentIndex] = tenders[i];
                currentIndex++;
            }
        }
        
        return activeTenders;
    }

    
    function getAwardedTenders() external view returns (Tender[] memory) {
        uint activeCount = 0;
        
        // Count active tenders
        for(uint i = 1; i <= tenderCount; i++) {
            if(tenders[i].tenderStatus == TenderStatus.Closed &&  tenders[i].winner != address(0) ){
                activeCount++;
            }
        }
        
        // Create result array
        Tender[] memory activeTenders = new Tender[](activeCount);
        uint currentIndex = 0;
        
        // Fill result array
        for(uint i = 1; i <= tenderCount; i++) {
            if(tenders[i].tenderStatus == TenderStatus.Closed && 
               tenders[i].winner != address(0)) {
                activeTenders[currentIndex] = tenders[i];
                currentIndex++;
            }
        }
        
        return activeTenders;
    }

    function getTenderDetails(uint _tenderId) external view returns (Tender memory) {
        Tender storage tender = tenders[_tenderId];

        return tender;
    }

    function placeBid(
        uint _tenderId,
        string memory _detailsFile,
        uint _amount
    ) public validTender(_tenderId) {
        bidCount++;
        Bid storage b = bids[bidCount];
        b.bidId = bidCount;
        b.tenderId = _tenderId;
        b.createdBy = msg.sender;
        b.detailsFile = _detailsFile;
        b.amount = _amount;
        b.issueDate = block.timestamp;
        b.status = BidStatus.Pending;

        tenders[_tenderId].bidIds.push(bidCount);
        bidsByBidder[msg.sender].push(bidCount);
    }

    function setBidStatus(uint _bidId, BidStatus _status)
        public
        validBid(_bidId)
        onlyCreator(bids[_bidId].tenderId)
    {
        bids[_bidId].status = _status;
    }

    function setWinner(uint _tenderId, address _winner)
        public
        validTender(_tenderId)
        onlyCreator(_tenderId)
    {
        uint[] memory bidIds = tenders[_tenderId].bidIds;
        bool winnerHasBid = false;
        
        for (uint i = 0; i < bidIds.length; i++) {
            uint bidId = bidIds[i];
            if (bids[bidId].createdBy == _winner) {
                bids[bidId].status = BidStatus.Accepted;
                winnerHasBid = true;
            } else {
                // Reject all other bids
                bids[bidId].status = BidStatus.Rejected;
            }
        }
        
        // Ensure the winner has placed a bid
        require(winnerHasBid, "Winner has not placed a bid");
        
        tenders[_tenderId].winner = _winner;
        tenders[_tenderId].tenderStatus = TenderStatus.Closed;
    }

    function logTransaction(TransactionInput memory input)
        public
        validTender(input.tenderId)
        onlyCreator(input.tenderId)
    {
        txCount++;
        Transaction storage txObj = transactions[txCount];
        txObj.txId = txCount;
        txObj.tenderId = input.tenderId;
        txObj.bidder = input.bidder;
        txObj.amount = input.amount;
        txObj.timestamp = block.timestamp;
        txObj.status = input.status;

        tenders[input.tenderId].transactionIds.push(txCount);
    }

    function disperseFunds(uint _tenderId, /* uint _phase,*/ uint _amount)
        public
        validTender(_tenderId)
        onlyCreator(_tenderId)
    {
        address payable winner = payable(tenders[_tenderId].winner);
        require(winner != address(0), "No winner selected");
        winner.transfer(_amount);

        TransactionInput memory input = TransactionInput({
            tenderId: _tenderId,
            bidder: winner,
            amount: _amount,
            status: "Phase Transfer"
        });

        logTransaction(input);
    }

    function updateStatus(uint _tenderId, uint _newStatus)
        public
        validTender(_tenderId)
        onlyCreator(_tenderId)
    {
        require(_newStatus <= uint(TenderStatus.Cancelled), "Invalid status");
        tenders[_tenderId].tenderStatus = TenderStatus(_newStatus);
    }

    // IMPROVED: Return Bid objects instead of just IDs
    function getBidsForTender(uint _tenderId) public view validTender(_tenderId) returns (Bid[] memory) {
        uint[] memory bidIds = tenders[_tenderId].bidIds;
        Bid[] memory tenderBids = new Bid[](bidIds.length);
        
        for (uint i = 0; i < bidIds.length; i++) {
            tenderBids[i] = bids[bidIds[i]];
        }
        
        return tenderBids;
    }

    // IMPROVED: Return Tender objects instead of just IDs
    function getTendersByCreator(address _creator) public view returns (Tender[] memory) {
        uint[] memory creatorTenderIds = tendersByCreator[_creator];
        Tender[] memory creatorTenders = new Tender[](creatorTenderIds.length);
        
        for (uint i = 0; i < creatorTenderIds.length; i++) {
            creatorTenders[i] = tenders[creatorTenderIds[i]];
        }
        
        return creatorTenders;
    }

    // IMPROVED: Return complete Bid objects instead of just IDs
    // This function returns all bids placed by a specific bidder address
    function getBidsByBidder(address _bidder) public view returns (Bid[] memory) {
        // First get the bid IDs associated with this bidder
        uint[] memory bidderBidIds = bidsByBidder[_bidder];
        
        // Create an array to hold the actual Bid objects
        Bid[] memory bidderBids = new Bid[](bidderBidIds.length);
        
        // Populate the array with full Bid objects by referencing each ID
        for (uint i = 0; i < bidderBidIds.length; i++) {
            bidderBids[i] = bids[bidderBidIds[i]];
        }
        
        return bidderBids;
    }

    // NEW: Get transactions for a specific tender
    function getTransactionsForTender(uint _tenderId) public view validTender(_tenderId) returns (Transaction[] memory) {
        uint[] memory txIds = tenders[_tenderId].transactionIds;
        Transaction[] memory tenderTxs = new Transaction[](txIds.length);
        
        for (uint i = 0; i < txIds.length; i++) {
            tenderTxs[i] = transactions[txIds[i]];
        }
        
        return tenderTxs;
    }

    receive() external payable {}
}