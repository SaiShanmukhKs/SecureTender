import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BidderContext } from '../contexts/BidderContext';

function SubmitBid() {
    const { submitBid, getTenderById, isLoading, error } = useContext(BidderContext);
    const { id } = useParams();
    const tenderId = parseInt(id);
    const navigate = useNavigate();

    const [tender, setTender] = useState(null);
    const [fetchingTender, setFetchingTender] = useState(true);
    const [bidSubmitting, setBidSubmitting] = useState(false);
    const [bidError, setBidError] = useState(null);
    const [bidData, setBidData] = useState({
        bidAmount: "",
        notes: ""
    });

    // Fetch tender details when component mounts
    useEffect(() => {
        const fetchTender = async () => {
            setFetchingTender(true);
            try {
                const tenderData = await getTenderById(tenderId);
                if (tenderData) {
                    setTender(tenderData);
                }
            } catch (err) {
                console.error("Error fetching tender:", err);
            } finally {
                setFetchingTender(false);
            }
        };

        if (tenderId) {
            fetchTender();
        }
    }, [tenderId, getTenderById]);

    if (fetchingTender) {
        return <div className="loading">Loading tender details...</div>;
    }

    if (!tender) {
        return <div className="error-message">Tender not found</div>;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBidSubmitting(true);
        setBidError(null);

        try {
            const result = await submitBid(tenderId, bidData);
            if (result) {
                navigate("/my-bids");
            } else {
                setBidError("Failed to submit bid. Please try again.");
            }
        } catch (err) {
            setBidError(`Error: ${err.message}`);
        } finally {
            setBidSubmitting(false);
        }
    };

    return (
        <div className="submit-bid">
            <h1>Submit Bid for Tender</h1>

            {bidError && (
                <div className="alert alert-error">
                    {bidError}
                </div>
            )}

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
                        disabled={bidSubmitting}
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
                        disabled={bidSubmitting}
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={bidSubmitting}
                    >
                        {bidSubmitting ? 'Submitting...' : 'Submit Bid'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/tender/${tenderId}`)}
                        className="btn btn-secondary"
                        disabled={bidSubmitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SubmitBid;