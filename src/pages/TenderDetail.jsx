import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BidderContext } from '../contexts/BidderContext';

function TenderDetail() {
    const { getTenderById, fetchMyBids, myBids, isLoading, error } = useContext(BidderContext);
    const { id } = useParams();
    const tenderId = parseInt(id);
    const navigate = useNavigate();

    const [tender, setTender] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [localError, setLocalError] = useState(null);
    const [myBid, setMyBid] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLocalLoading(true);
            try {
                // Fetch the specific tender by ID
                const tenderData = await getTenderById(tenderId);
                setTender(tenderData);

                // Fetch user's bids to find if there's one for this tender
                await fetchMyBids();
            } catch (err) {
                setLocalError(err.message || 'Failed to load tender details');
            } finally {
                setLocalLoading(false);
            }
        };

        loadData();
    }, [tenderId, getTenderById, fetchMyBids]);

    // Find the bid for this tender from the myBids array
    useEffect(() => {
        if (myBids && myBids.length > 0) {
            const bid = myBids.find(b => b.tenderId === tenderId);
            setMyBid(bid);
        }
    }, [myBids, tenderId]);

    if (localLoading || isLoading) {
        return <div>Loading tender details...</div>;
    }

    if (localError || error) {
        return <div>Error: {localError || error}</div>;
    }

    if (!tender) {
        return <div>Tender not found</div>;
    }

    return (
        <div className="tender-detail">
            <h1>Tender Details</h1>

            <div className="detail-header">
                <h2>{tender.title}</h2>
                <span className={`status ${tender.status.toLowerCase()}`}>{tender.status}</span>
            </div>

            <div className="detail-section">
                <h3>Description</h3>
                <p>{tender.description}</p>
            </div>

            <div className="detail-grid">
                <div className="detail-item">
                    <h3>Created By</h3>
                    <p>{tender.createdBy}</p>
                </div>
                <div className="detail-item">
                    <h3>Category</h3>
                    <p>{tender.category}</p>
                </div>
                <div className="detail-item">
                    <h3>Estimated Budget</h3>
                    <p>${tender.estimatedBudget}</p>
                </div>
                <div className="detail-item">
                    <h3>Submission Deadline</h3>
                    <p>{tender.deadline}</p>
                </div>
            </div>

            <div className="detail-section">
                <h3>Documents</h3>
                <ul className="document-list">
                    {tender.documents && tender.documents.map((doc, index) => (
                        <li key={index}>
                            <span className="document-icon">📄</span>
                            <span className="document-name">{doc}</span>
                            <button className="btn btn-sm">Download</button>
                        </li>
                    ))}
                </ul>
            </div>

            {myBid && (
                <div className="my-bid-section">
                    <h3>My Bid</h3>
                    <div className="bid-details">
                        <div className="bid-info">
                            <p><strong>Amount:</strong> ${myBid.bidAmount.toLocaleString()}</p>
                            <p><strong>Submitted:</strong> {myBid.submissionDate}</p>
                            <p><strong>Status:</strong> <span className={`status ${myBid.status.toLowerCase()}`}>{myBid.status}</span></p>
                        </div>
                        <div className="bid-notes">
                            <p><strong>Notes:</strong></p>
                            <p>{myBid.notes}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="detail-actions">
                {tender.status === "Open" && !myBid && (
                    <button
                        onClick={() => navigate(`/submit-bid/${tenderId}`)}
                        className="btn btn-primary"
                    >
                        Submit Bid
                    </button>
                )}
                <button onClick={() => navigate("/tenders")} className="btn btn-secondary">
                    Back to Tenders
                </button>
            </div>
        </div>
    );
}

export default TenderDetail;