import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBlockchainTendering } from '../../context/ContractContext';

function MyBids() {
    const statusMapping = {
        "0": "Closed",
        "1": "Open",
        "2": "Cancelled"
    };

    const getStatusKey = (status) => status.toString();

    const blockchain = useBlockchainTendering();
    const [filter, setFilter] = useState("all");
    const [filteredBids, setFilteredBids] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define the fetchMyBids function as a useCallback
    const fetchMyBids = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // First, get the current user's address from metamask
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            const userAddress = accounts[0];

            if (!userAddress) {
                throw new Error("No connected wallet found");
            }

            // Get all bid IDs for the current user using the contract function
            const myBids = await blockchain.getBidsByBidder(userAddress);
            console.log("Bid IDs:", myBids);
            const userBids = [];

            // Process each bid
            for (const bid of myBids) {
                // Get bid details
                console.log(typeof (bid.detailsFile));
                // const bid = await blockchain.getBidDetails(bid);

                // Get tender details to add title
                const tenderDetails = await blockchain.getTenderDetails(bid.tenderId);

                // Enum mapping: TenderStatus {Closed=0, Open=1, Cancelled=2}
                const statusMapping = {
                    "0": "Closed",
                    "1": "Open",
                    "2": "Cancelled"
                }

                const statusKey = typeof bid.status === 'bigint' ?
                    bid.status.toString() : bid.status.toString();

                // Convert BigInt status to number for comparison
                const statusValue = typeof bid.status === 'bigint' ? Number(bid.status) : bid.status;

                // Convert the BidStatus enum to string representation
                let statusText = "Submitted";
                if (statusValue === 1) statusText = "Awarded";  // Changed from "Accepted" to "Awarded" to match your filter
                else if (statusValue === 2) statusText = "Rejected";

                const bidAmountInWei = typeof bid.amount === 'bigint' ?
                    bid.amount.toString() : bid.amount;

                // Format bid for display
                userBids.push({
                    id: bid,
                    tenderId: bid.tenderId,
                    tenderTitle: tenderDetails.title,
                    bidAmount: blockchain.fromWei ? blockchain.fromWei(bidAmountInWei) :
                        (bidAmountInWei / 1e18).toString(),
                    submissionDate: new Date(Number(bid.issueDate) * 1000).toLocaleDateString('en-GB', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                    }),
                    status: statusText,
                    notes: bid.detailsFile
                });
            }

            setMyBids(userBids);
        } catch (err) {
            console.error('Error fetching bids:', err);
            setError(err.message || "Failed to fetch your bids");
        } finally {
            setIsLoading(false);
        }
    }, [blockchain]);

    // Fetch bids when component mounts
    useEffect(() => {
        fetchMyBids();
    }, [fetchMyBids]);

    // Apply filter when either filter or myBids changes
    useEffect(() => {
        const filtered = myBids.filter(bid => {
            return filter === "all" || bid.status.toLowerCase() === filter.toLowerCase();
        });
        setFilteredBids(filtered);
    }, [filter, myBids]);

    if (isLoading && myBids.length === 0) {
        return <div className="loading">Loading your bids...</div>;
    }

    if (error && myBids.length === 0) {
        return <div className="error-message">Error loading bids: {error}</div>;
    }

    return (
        <div className="my-bids">
            <h1>My Bids</h1>

            <div className="filter-buttons">
                <button
                    className={filter === "all" ? "active" : ""}
                    onClick={() => setFilter("all")}
                >
                    All Bids
                </button>
                <button
                    className={filter === "submitted" ? "active" : ""}
                    onClick={() => setFilter("submitted")}
                >
                    Submitted
                </button>
                <button
                    className={filter === "shortlisted" ? "active" : ""}
                    onClick={() => setFilter("shortlisted")}
                >
                    Shortlisted
                </button>
                <button
                    className={filter === "awarded" ? "active" : ""}
                    onClick={() => setFilter("awarded")}
                >
                    Awarded
                </button>
                <button
                    className={filter === "rejected" ? "active" : ""}
                    onClick={() => setFilter("rejected")}
                >
                    Rejected
                </button>
            </div>

            {isLoading && myBids.length > 0 && (
                <div className="loading-overlay">Refreshing bids...</div>
            )}

            {filteredBids.length > 0 ? (
                <div className="bid-list">
                    {filteredBids.map(bid => (
                        <div key={bid.id} className="bid-card">
                            <div className="bid-header">
                                <h3>{bid.tenderTitle}</h3>
                                <span className={`status ${bid.status.toLowerCase()}`}>{bid.status}</span>
                            </div>

                            <div className="bid-details">
                                <div className="bid-info-row">
                                    <div className="bid-info-item">
                                        <span className="label">Bid Amount:</span>
                                        <span className="value">{bid.bidAmount.toLocaleString()} ETH</span>
                                    </div>
                                    <div className="bid-info-item">
                                        <span className="label">Submitted On:</span>
                                        <span className="value">{bid.submissionDate}</span>
                                    </div>
                                </div>

                                <div className="bid-notes">
                                    <span className="label">Notes:</span>
                                    <p>{bid.notes}</p>
                                </div>
                            </div>

                            <div className="bid-actions">
                                <Link to={`/tender/${bid.tenderId}`} className="btn btn-secondary">View Tender</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-results">No bids found with the selected filter.</p>
            )}

            <div className="refresh-section">
                <button
                    onClick={() => fetchMyBids()}
                    className="btn btn-secondary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Refreshing...' : 'Refresh Bids'}
                </button>
            </div>
        </div>
    );
}

export default MyBids;