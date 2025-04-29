// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title BlockchainTenderingSystem
 * @dev A complete system for managing tenders on blockchain
 */
contract BlockchainTenderingSystem {
    address public owner;
    
    // Enums
    enum BidStatus { Pending, Accepted, Approved, Rejected }
    enum TenderStatus { Open, Closed, Canceled }
    enum PaymentStatus { Pending, Processed, Released, Refunded }
    
    // Structs
    struct Bid {
        uint bidId;
        uint tenderId;
        address bidderAddress;
        uint bidderId;
        string bidDetails;
        uint amount;
        uint issueDate;
        BidStatus status;
    }
    
    struct Transaction {
        uint txId;
        uint tenderId;
        uint bidderId;
        uint amount;
        uint timestamp;
        PaymentStatus status;
        string description;
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
        uint tenderCreatorId;
        TenderStatus status;
        address winner;
        uint winnerBidId;
        uint bidCounter;
    }
    
    // Mappings
    mapping(uint => Tender) public tenders;
    mapping(uint => mapping(uint => Bid)) public tenderBids;
    mapping(uint => Transaction) public transactions;
    mapping(address => uint) public addressToBidderId;
    mapping(address => uint) public addressToTenderCreatorId;
    mapping(uint => uint[]) public bidderRatings;
    mapping(uint => uint[]) public tenderCreatorTenders;
    mapping(uint => uint[]) public bidderBids;
    
    // Counters
    uint public tenderCounter;
    uint public transactionCounter;
    uint public bidCounter;
    
    // Events
    event TenderCreated(uint tenderId, string title, address createdBy);
    event BidPlaced(uint bidId, uint tenderId, address bidderAddress);
    event BidStatusChanged(uint bidId, uint tenderId, BidStatus status);
    event TenderStatusChanged(uint tenderId, TenderStatus status);
    event WinnerSelected(uint tenderId, address winner, uint bidId);
    event TransactionRecorded(uint txId, uint tenderId, uint bidderId, uint amount);
    event BidderRegistered(uint bidderId, address bidderAddress);
    event TenderCreatorRegistered(uint tenderCreatorId, address tenderCreatorAddress);
    event PaymentReleased(uint tenderId, uint amount, uint phase);
    event BidderRated(uint bidderId, uint rating);
    
    // Tender Management Functions
    function createTender(
        string memory _title,
        string memory _rfp,
        uint _startDate,
        uint _endDate,
        uint _tenderFee,
        uint _registrationFee,
        uint _moneyDispersalPhases
    ) external returns (uint) {
        require(_startDate < _endDate, "End date must be after start date");
        
        uint tenderCreatorId = addressToTenderCreatorId[msg.sender];
        
        tenderCounter++;
        Tender storage newTender = tenders[tenderCounter];
        newTender.tenderId = tenderCounter;
        newTender.title = _title;
        newTender.rfp = _rfp;
        newTender.startDate = _startDate;
        newTender.endDate = _endDate;
        newTender.tenderFee = _tenderFee;
        newTender.registrationFee = _registrationFee;
        newTender.moneyDispersalPhases = _moneyDispersalPhases;
        newTender.createdBy = msg.sender;
        newTender.tenderCreatorId = tenderCreatorId;
        newTender.status = TenderStatus.Open;
        newTender.winner = address(0);
        newTender.bidCounter = 0;
        
        tenderCreatorTenders[tenderCreatorId].push(tenderCounter);
        
        emit TenderCreated(tenderCounter, _title, msg.sender);
        return tenderCounter;
    }
    
    function closeTender(uint _tenderId) external {
        require(tenders[_tenderId].status == TenderStatus.Open, "Tender is not open");
        
        tenders[_tenderId].status = TenderStatus.Closed;
        
        emit TenderStatusChanged(_tenderId, TenderStatus.Closed);
    }
    
    function cancelTender(uint _tenderId) external  {
        require(tenders[_tenderId].status == TenderStatus.Open, "Tender is not open");
        
        tenders[_tenderId].status = TenderStatus.Canceled;
        
        emit TenderStatusChanged(_tenderId, TenderStatus.Canceled);
    }
    
    function getTenderDetails(uint _tenderId) external view returns (
        string memory title,
        string memory rfp,
        uint startDate,
        uint endDate,
        uint tenderFee,
        uint registrationFee,
        uint moneyDispersalPhases,
        address createdBy,
        TenderStatus status,
        address winner,
        uint bidCount
    ) {
        Tender storage tender = tenders[_tenderId];
        
        return (
            tender.title,
            tender.rfp,
            tender.startDate,
            tender.endDate,
            tender.tenderFee,
            tender.registrationFee,
            tender.moneyDispersalPhases,
            tender.createdBy,
            tender.status,
            tender.winner,
            tender.bidCounter
        );
    }
    
    // Bid Management Functions
    function placeBid(
        uint _tenderId,
        string memory _bidDetails,
        uint _amount
    ) external payable returns (uint) {
        uint bidderId = addressToBidderId[msg.sender];
        Tender storage tender = tenders[_tenderId];
        
        // Check if tender fee is paid
        require(msg.value >= tender.tenderFee, "Tender fee not paid");
        
        bidCounter++;
        tender.bidCounter++;
        
        Bid storage newBid = tenderBids[_tenderId][bidCounter];
        newBid.bidId = bidCounter;
        newBid.tenderId = _tenderId;
        newBid.bidderAddress = msg.sender;
        newBid.bidderId = bidderId;
        newBid.bidDetails = _bidDetails;
        newBid.amount = _amount;
        newBid.issueDate = block.timestamp;
        newBid.status = BidStatus.Pending;
        
        bidderBids[bidderId].push(bidCounter);
        
        emit BidPlaced(bidCounter, _tenderId, msg.sender);
        
        // Record the transaction for the tender fee
        recordTransaction(_tenderId, bidderId, tender.tenderFee, "Tender Fee", PaymentStatus.Processed);
        
        return bidCounter;
    }
    
    function approveBid(uint _tenderId, uint _bidId) external {
        require(tenders[_tenderId].status == TenderStatus.Open, "Tender is not open");
        
        tenderBids[_tenderId][_bidId].status = BidStatus.Approved;
        
        emit BidStatusChanged(_bidId, _tenderId, BidStatus.Approved);
    }
    
    function rejectBid(uint _tenderId, uint _bidId) external {
        require(tenders[_tenderId].status == TenderStatus.Open, "Tender is not open");
        
        tenderBids[_tenderId][_bidId].status = BidStatus.Rejected;
        
        emit BidStatusChanged(_bidId, _tenderId, BidStatus.Rejected);
    }
    
    function getBidDetails(uint _tenderId, uint _bidId) external view returns (
        address bidderAddress,
        uint bidderId,
        string memory bidDetails,
        uint amount,
        uint issueDate,
        BidStatus status
    ) {
        Bid storage bid = tenderBids[_tenderId][_bidId];
        
        return (
            bid.bidderAddress,
            bid.bidderId,
            bid.bidDetails,
            bid.amount,
            bid.issueDate,
            bid.status
        );
    }
    
    function setWinner(uint _tenderId, uint _bidId) external {
        require(tenders[_tenderId].status == TenderStatus.Open, "Tender is not open");
        
        Bid storage winningBid = tenderBids[_tenderId][_bidId];
        require(winningBid.status == BidStatus.Approved, "Bid must be approved to be selected as winner");
        
        tenders[_tenderId].winner = winningBid.bidderAddress;
        tenders[_tenderId].winnerBidId = _bidId;
        tenders[_tenderId].status = TenderStatus.Closed;
        
        emit WinnerSelected(_tenderId, winningBid.bidderAddress, _bidId);
        emit TenderStatusChanged(_tenderId, TenderStatus.Closed);
    }
    
    // Payment and Transaction Functions
    function recordTransaction(
        uint _tenderId,
        uint _bidderId,
        uint _amount,
        string memory _description,
        PaymentStatus _status
    ) internal returns (uint) {
        transactionCounter++;
        
        Transaction storage newTransaction = transactions[transactionCounter];
        newTransaction.txId = transactionCounter;
        newTransaction.tenderId = _tenderId;
        newTransaction.bidderId = _bidderId;
        newTransaction.amount = _amount;
        newTransaction.timestamp = block.timestamp;
        newTransaction.status = _status;
        newTransaction.description = _description;
        
        emit TransactionRecorded(transactionCounter, _tenderId, _bidderId, _amount);
        
        return transactionCounter;
    }
    
    function initiatePayment(uint _tenderId) external payable {
        require(tenders[_tenderId].status == TenderStatus.Closed, "Tender must be closed");
        require(tenders[_tenderId].winner != address(0), "No winner has been selected");
        
        uint bidId = tenders[_tenderId].winnerBidId;
        Bid storage winningBid = tenderBids[_tenderId][bidId];
        uint bidderId = winningBid.bidderId;
        
        // Ensure payment matches the winning bid amount
        require(msg.value == winningBid.amount, "Payment amount must match the winning bid amount");
        
        // Record transaction
        recordTransaction(_tenderId, bidderId, winningBid.amount, "Initial Payment", PaymentStatus.Processed);
    }
    
    function releasePayment(uint _tenderId, uint _phase, uint _amount) external {
        require(tenders[_tenderId].status == TenderStatus.Closed, "Tender must be closed");
        require(tenders[_tenderId].winner != address(0), "No winner has been selected");
        
        Tender storage tender = tenders[_tenderId];
        uint bidId = tender.winnerBidId;
        Bid storage winningBid = tenderBids[_tenderId][bidId];
        
        require(_phase <= tender.moneyDispersalPhases, "Invalid phase number");
        require(_amount <= address(this).balance, "Contract has insufficient funds");
        
        // Transfer funds to the winner's address
        payable(tender.winner).transfer(_amount);
        
        // Record transaction
        recordTransaction(_tenderId, winningBid.bidderId, _amount, string(abi.encodePacked("Phase ", _phase, " Payment")), PaymentStatus.Released);
        
        emit PaymentReleased(_tenderId, _amount, _phase);
    }
    
    function withdrawFees() external {
        uint balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner).transfer(balance);
    }
    
    // Utility and Query Functions
    function getActiveTenders() external view returns (uint[] memory) {
        uint activeCount = 0;
        
        // Count active tenders
        for(uint i = 1; i <= tenderCounter; i++) {
            if(tenders[i].status == TenderStatus.Open && 
               block.timestamp >= tenders[i].startDate && 
               block.timestamp <= tenders[i].endDate) {
                activeCount++;
            }
        }
        
        // Create result array
        uint[] memory activeTenderIds = new uint[](activeCount);
        uint currentIndex = 0;
        
        // Fill result array
        for(uint i = 1; i <= tenderCounter; i++) {
            if(tenders[i].status == TenderStatus.Open && 
               block.timestamp >= tenders[i].startDate && 
               block.timestamp <= tenders[i].endDate) {
                activeTenderIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return activeTenderIds;
    }
    
    
    function getTenderBids(uint _tenderId) external view returns (uint[] memory) {
        Tender storage tender = tenders[_tenderId];
        uint bidCount = tender.bidCounter;
        
        uint[] memory bidIds = new uint[](bidCount);
        uint currentIndex = 0;
        
        // This is a simplification - we would need a more efficient way to store and retrieve bids
        for(uint i = 1; i <= bidCounter; i++) {
            if(tenderBids[_tenderId][i].tenderId == _tenderId) {
                bidIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return bidIds;
    }
    
    // Check if current date is between tender start and end dates
    function isTenderActive(uint _tenderId) external view returns (bool) {
        Tender storage tender = tenders[_tenderId];
        return (
            tender.status == TenderStatus.Open &&
            block.timestamp >= tender.startDate &&
            block.timestamp <= tender.endDate
        );
    }
    
    // Receive function to accept ether
    receive() external payable {}
}