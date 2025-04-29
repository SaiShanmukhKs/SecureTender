// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockchainTendering {
    uint public tenderCount;
    uint public bidCount;
    uint public txCount;

    enum BidStatus { Pending, Accepted, Rejected }

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
        string bidDetails;
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
        uint earnestFee;
        uint[] moneyDispersalPhases;
        address createdBy;
        string tenderType;
        string status;
        address winner;
        uint[] bidIds;
        uint[] transactionIds;
    }

    // Input structs to reduce stack depth
    struct TenderInput {
        string title;
        string rfp;
        uint startDate;
        uint endDate;
        uint tenderFee;
        uint earnestFee;
        uint[] moneyDispersalPhases;
        string tenderType;
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

    function createTender(TenderInput memory input) public {
        tenderCount++;
        Tender storage t = tenders[tenderCount];
        t.tenderId = tenderCount;
        t.title = input.title;
        t.rfp = input.rfp;
        t.startDate = input.startDate;
        t.endDate = input.endDate;
        t.tenderFee = input.tenderFee;
        t.earnestFee = input.earnestFee;
        t.moneyDispersalPhases = input.moneyDispersalPhases;
        t.createdBy = msg.sender;
        t.tenderType = input.tenderType;
        t.status = "Open";

        tendersByCreator[msg.sender].push(tenderCount);
    }

    function placeBid(
        uint _tenderId,
        string memory _detailsFile,
        string memory _bidDetails,
        uint _amount
    ) public validTender(_tenderId) {
        bidCount++;
        Bid storage b = bids[bidCount];
        b.bidId = bidCount;
        b.tenderId = _tenderId;
        b.createdBy = msg.sender;
        b.detailsFile = _detailsFile;
        b.bidDetails = _bidDetails;
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
        tenders[_tenderId].winner = _winner;
        tenders[_tenderId].status = "Closed";
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

    function updateStatus(uint _tenderId, string memory _newStatus)
        public
        validTender(_tenderId)
        onlyCreator(_tenderId)
    {
        tenders[_tenderId].status = _newStatus;
    }

    function getBidsForTender(uint _tenderId) public view validTender(_tenderId) returns (uint[] memory) {
        return tenders[_tenderId].bidIds;
    }

    function getTendersByCreator(address _creator) public view returns (uint[] memory) {
        return tendersByCreator[_creator];
    }

    function getBidsByBidder(address _bidder) public view returns (uint[] memory) {
        return bidsByBidder[_bidder];
    }

    receive() external payable {}
}
