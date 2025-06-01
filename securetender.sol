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
        uint totalAmount; // Total amount to be dispersed
        uint dispersedAmount; // Amount already dispersed
        uint phasesCompleted; // Number of phases completed
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

    // Events
    event WinnerSelected(uint indexed tenderId, address indexed winner, uint amount);
    event FundsReceived(uint indexed tenderId, address indexed from, uint amount);
    event FundsDispersed(uint indexed tenderId, address indexed to, uint amount, uint phase);

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
        require(phases > 0, "Phases must be greater than 0");
        
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
        t.totalAmount = 0;
        t.dispersedAmount = 0;
        t.phasesCompleted = 0;

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

    // Function to get the Awarded Tenders
    function getAwardedTenders(address _tenderCreator) external view returns (Tender[] memory) {
        uint awardedCount = 0;
        
        // Count awarded tenders for this creator
        for(uint i = 1; i <= tenderCount; i++) {
            if(tenders[i].createdBy == _tenderCreator && 
            tenders[i].tenderStatus == TenderStatus.Closed && 
            tenders[i].winner != address(0)) {
                awardedCount++;
            }
        }
        
        // Create result array
        Tender[] memory awardedTenders = new Tender[](awardedCount);
        uint currentIndex = 0;
        
        // Fill result array
        for(uint i = 1; i <= tenderCount; i++) {
            if(tenders[i].createdBy == _tenderCreator && 
            tenders[i].tenderStatus == TenderStatus.Closed && 
            tenders[i].winner != address(0)) {
                awardedTenders[currentIndex] = tenders[i];
                currentIndex++;
            }
        }
        
        return awardedTenders;
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
        require(tenders[_tenderId].tenderStatus == TenderStatus.Open, "Tender is not open");
        require(block.timestamp <= tenders[_tenderId].endDate, "Tender has ended");
        require(_amount > 0, "Bid amount must be greater than 0");
        
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
        require(tenders[_tenderId].tenderStatus == TenderStatus.Open, "Tender is not open");
        
        uint[] memory bidIds = tenders[_tenderId].bidIds;
        bool winnerHasBid = false;
        uint winningBidAmount = 0;
        
        // Find the winning bid and set statuses
        for (uint i = 0; i < bidIds.length; i++) {
            uint bidId = bidIds[i];
            if (bids[bidId].createdBy == _winner) {
                bids[bidId].status = BidStatus.Accepted;
                winnerHasBid = true;
                winningBidAmount = bids[bidId].amount;
            } else {
                // Reject all other bids
                bids[bidId].status = BidStatus.Rejected;
            }
        }
        
        // Ensure the winner has placed a bid
        require(winnerHasBid, "Winner has not placed a bid");
        
        tenders[_tenderId].winner = _winner;
        tenders[_tenderId].tenderStatus = TenderStatus.Closed;
        tenders[_tenderId].totalAmount = winningBidAmount;
        
        emit WinnerSelected(_tenderId, _winner, winningBidAmount);
    }

    // Function for winner to send the bid amount to the contract
    function sendBidAmount(uint _tenderId) 
        public 
        payable 
        validTender(_tenderId) 
        onlyWinner(_tenderId) 
    {
        require(tenders[_tenderId].tenderStatus == TenderStatus.Closed, "Tender is not closed");
        require(msg.value == tenders[_tenderId].totalAmount, "Incorrect amount sent");
        require(address(this).balance >= msg.value, "Contract balance insufficient");
        
        emit FundsReceived(_tenderId, msg.sender, msg.value);
        
        // Log the transaction
        TransactionInput memory input = TransactionInput({
            tenderId: _tenderId,
            bidder: msg.sender,
            amount: msg.value,
            status: "Funds Received"
        });
        
        logTransaction(input);
    }

    // New disperseFunds function that disperses funds in equal phases
    function disperseFunds(uint _tenderId)
        public
        validTender(_tenderId)
        onlyCreator(_tenderId)
    {
        Tender storage tender = tenders[_tenderId];
        require(tender.tenderStatus == TenderStatus.Closed, "Tender is not closed");
        require(tender.winner != address(0), "No winner selected");
        require(tender.phasesCompleted < tender.moneyDispersalPhases, "All phases completed");
        require(address(this).balance >= tender.totalAmount, "Insufficient contract balance");
        
        // Calculate amount per phase
        uint amountPerPhase = tender.totalAmount / tender.moneyDispersalPhases;
        
        // For the last phase, send any remaining amount due to rounding
        if (tender.phasesCompleted == tender.moneyDispersalPhases - 1) {
            amountPerPhase = tender.totalAmount - tender.dispersedAmount;
        }
        
        require(amountPerPhase > 0, "No amount to disperse");
        
        address payable winner = payable(tender.winner);
        
        // Transfer the funds
        winner.transfer(amountPerPhase);
        
        // Update tender state
        tender.dispersedAmount += amountPerPhase;
        tender.phasesCompleted++;
        
        emit FundsDispersed(_tenderId, winner, amountPerPhase, tender.phasesCompleted);
        
        // Log the transaction
        TransactionInput memory input = TransactionInput({
            tenderId: _tenderId,
            bidder: winner,
            amount: amountPerPhase,
            status: string(abi.encodePacked("Phase ", uintToString(tender.phasesCompleted), " Transfer"))
        });
        
        logTransaction(input);
    }

    // Helper function to convert uint to string
    function uintToString(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // Get remaining phases for a tender
    function getRemainingPhases(uint _tenderId) public view validTender(_tenderId) returns (uint) {
        return tenders[_tenderId].moneyDispersalPhases - tenders[_tenderId].phasesCompleted;
    }

    // Get phase information for a tender
    function getPhaseInfo(uint _tenderId) public view validTender(_tenderId) returns (
        uint totalPhases,
        uint completedPhases,
        uint remainingPhases,
        uint totalAmount,
        uint dispersedAmount,
        uint remainingAmount,
        uint amountPerPhase
    ) {
        Tender storage tender = tenders[_tenderId];
        totalPhases = tender.moneyDispersalPhases;
        completedPhases = tender.phasesCompleted;
        remainingPhases = totalPhases - completedPhases;
        totalAmount = tender.totalAmount;
        dispersedAmount = tender.dispersedAmount;
        remainingAmount = totalAmount - dispersedAmount;
        amountPerPhase = totalAmount > 0 ? totalAmount / totalPhases : 0;
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
    function getBidsByBidder(address _bidder) public view returns (Bid[] memory) {
        uint[] memory bidderBidIds = bidsByBidder[_bidder];
        Bid[] memory bidderBids = new Bid[](bidderBidIds.length);
        
        for (uint i = 0; i < bidderBidIds.length; i++) {
            bidderBids[i] = bids[bidderBidIds[i]];
        }
        
        return bidderBids;
    }

    // Get transactions for a specific tender
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