import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlockchainTendering } from '../contexts/ContractContext';
import StatusBadge from '../components/StatusBadge';
import useParams from '../hooks/useParams';

const TenderDetail = () => {
    const [tender, setTender] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const blockchain = useBlockchainTendering();
    const navigate = useNavigate();
    const { id } = useParams();
    const tenderId = parseInt(id);

    const statusMapping = {
        "0": "Closed",
        "1": "Open",
        "2": "Cancelled"
    };

    const getStatusKey = (status) => status.toString();

    useEffect(() => {
        const fetchTenderDetails = async () => {
            try {
                setLoading(true);
                const tenderDetails = await blockchain.getTenderDetails(tenderId);
                setTender(tenderDetails);
                setError(null);
            } catch (error) {
                console.error("Error fetching tender details:", error);
                setError("Failed to load tender details. Please check your connection to MetaMask and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTenderDetails();
    }, [blockchain, tenderId]);

    if (loading) return <div className="no-results">Loading tender details...</div>;
    if (error) return <div className="no-results">{error}</div>;
    if (!tender) return <div className="no-results">Tender not found</div>;

    const handleAward = (bidderId) => {
        blockchain.awardTender(tenderId, bidderId);
        navigate("/awarded-tenders");
    };

    const handleSubmitBid = () => {
        navigate(`/submit-bid/${tenderId}`);
    };

    const awardedBidder = tender.awardedTo
        ? tender.bidders.find(b => b.id === tender.awardedTo)
        : null;

    return (
        <div className="content">
            <div className="detail-header">
                <h1>{tender.title}</h1>
                <StatusBadge status={statusMapping[getStatusKey(tender.tenderStatus)]} />
            </div>

            <div className="detail-section">
                <div className="detail-grid">
                    <div className="detail-item">
                        <strong>Deadline</strong>
                        <p>{new Date(Number(tender.endDate) * 1000).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="detail-item">
                        <strong>Description</strong>
                        <p>{tender.rfp}</p>
                    </div>
                </div>
            </div>

            {awardedBidder && (
                <div className="detail-section">
                    <h3>Awarded To</h3>
                    <div className="detail-grid">
                        <div className="detail-item"><strong>Vendor</strong><p>{awardedBidder.name}</p></div>
                        <div className="detail-item"><strong>Bid Amount</strong><p>${awardedBidder.bid.toLocaleString()}</p></div>
                        <div className="detail-item"><strong>Rating</strong><p>{awardedBidder.rating.toFixed(1)}/5</p></div>
                    </div>
                </div>
            )}

            {statusMapping[getStatusKey(tender.tenderStatus)] === "Open" && (
                <div className="detail-section">
                    <h3>Submit Your Bid</h3>
                    <p>Interested in bidding on this tender? Click the button below to submit your proposal.</p>
                    <button className="btn btn-primary" onClick={handleSubmitBid}>
                        Submit Bid
                    </button>
                </div>
            )}

            <div className="form-actions">
                <Link to="/tenders" className="btn btn-secondary">Back to All Tenders</Link>
            </div>
        </div>
    );
};

export default TenderDetail;