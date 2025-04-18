import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BidderContext } from '../contexts/BidderContext';

function SubmitBid() {
    const { tenders, submitBid } = useContext(BidderContext);
    const { id } = useParams();
    const tenderId = parseInt(id);
    const navigate = useNavigate();

    const [bidData, setBidData] = useState({
        bidAmount: "",
        notes: ""
    });

    const tender = tenders.find(t => t.id === tenderId);

    if (!tender) {
        return <div>Tender not found</div>;
    }

    if (tender.status !== "Open") {
        return (
            <div className="submit-bid">
                <h1>Submit Bid</h1>
                <div className="alert alert-error">
                    This tender is no longer accepting bids.
                </div>
                <button onClick={() => navigate("/tenders")} className="btn btn-secondary">
                    Back to Tenders
                </button>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBidData({
            ...bidData,
            [name]: name === "bidAmount" ? parseFloat(value) || "" : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (submitBid(tenderId, bidData)) {
            navigate("/my-bids");
        }
    };

    return (
        <div className="submit-bid">
            <h1>Submit Bid for Tender</h1>

            <div className="tender-summary">
                <h2>{tender.title}</h2>
                <p>{tender.description}</p>
                <div className="summary-details">
                    <p><strong>Created by:</strong> {tender.createdBy}</p>
                    <p><strong>Deadline:</strong> {tender.deadline}</p>
                    <p><strong>Estimated Budget:</strong> ${tender.estimatedBudget}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bid-form">
                <div className="form-group">
                    <label htmlFor="bidAmount">Bid Amount ($)</label>
                    <input
                        type="number"
                        id="bidAmount"
                        name="bidAmount"
                        value={bidData.bidAmount}
                        onChange={handleChange}
                        required
                        min="1"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Bid Notes/Proposal Details</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={bidData.notes}
                        onChange={handleChange}
                        placeholder="Describe your bid details, terms, and any special considerations..."
                        required
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Submit Bid</button>
                    <button
                        type="button"
                        onClick={() => navigate(`/tender/${tenderId}`)}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SubmitBid;