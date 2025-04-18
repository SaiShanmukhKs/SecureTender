import React, { useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BidderContext } from '../contexts/BidderContext';

function TenderDetail() {
    const { tenders, myBids } = useContext(BidderContext);
    const { id } = useParams();
    const tenderId = parseInt(id);
    const navigate = useNavigate();

    const tender = tenders.find(t => t.id === tenderId);
    const myBid = myBids.find(b => b.tenderId === tenderId);

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
                    {tender.documents.map((doc, index) => (
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