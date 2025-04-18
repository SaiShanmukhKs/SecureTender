import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BidderContext } from '../contexts/BidderContext';

function MyBids() {
    const { myBids } = useContext(BidderContext);
    const [filter, setFilter] = useState("all");

    // Filter bids based on status
    const filteredBids = myBids.filter(bid => {
        return filter === "all" || bid.status.toLowerCase() === filter.toLowerCase();
    });

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
                                        <span className="value">${bid.bidAmount.toLocaleString()}</span>
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
        </div>
    );
}

export default MyBids;