import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TenderContext } from '../context/TenderContext';
import StatusBadge from '../components/StatusBadge';
import useParams from '../hooks/useParams';

const TenderDetail = () => {
    const { tenders, awardTender, addMockBidders } = useContext(TenderContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const tenderId = parseInt(id);

    const tender = tenders.find(t => t.id === tenderId);

    if (!tender) {
        return <div>Tender not found</div>;
    }

    const sortedBidders = [...tender.bidders].sort((a, b) => {
        const scoreA = (a.rating * 10000) / a.bid;
        const scoreB = (b.rating * 10000) / b.bid;
        return scoreB - scoreA;
    });

    const handleAward = (bidderId) => {
        awardTender(tenderId, bidderId);
        navigate("/awarded-tenders");
    };

    const handleAddBidders = () => {
        addMockBidders(tenderId);
    };

    const awardedBidder = tender.awardedTo
        ? tender.bidders.find(bidder => bidder.id === tender.awardedTo)
        : null;

    return (
        <div className="tender-detail">
            <h1>Tender Details</h1>

            <div className="tender-info">
                <h2>{tender.title}</h2>
                <p><strong>Status:</strong> <StatusBadge status={tender.status} /></p>
                <p><strong>Deadline:</strong> {tender.deadline}</p>
                <p><strong>Description:</strong> {tender.description}</p>

                {awardedBidder && (
                    <div className="awarded-info">
                        <h3>Awarded To</h3>
                        <p><strong>Vendor:</strong> {awardedBidder.name}</p>
                        <p><strong>Bid Amount:</strong> ${awardedBidder.bid.toLocaleString()}</p>
                        <p><strong>Rating:</strong> {awardedBidder.rating.toFixed(1)}/5</p>
                    </div>
                )}
            </div>

            {tender.status === "Open" && (
                <div className="bidders-section">
                    <div className="bidders-header">
                        <h3>Bidders</h3>
                        {tender.bidders.length === 0 && (
                            <button onClick={handleAddBidders} className="btn btn-secondary">
                                Simulate Bidders (Demo)
                            </button>
                        )}
                    </div>

                    {tender.bidders.length > 0 ? (
                        <div className="top-bidders">
                            <h4>Top 3 Bidders (Sorted by Rating and Bid)</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Bid Amount</th>
                                        <th>Rating</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedBidders.slice(0, 3).map((bidder, index) => (
                                        <tr key={bidder.id}>
                                            <td>{index + 1}</td>
                                            <td>{bidder.name}</td>
                                            <td>${bidder.bid.toLocaleString()}</td>
                                            <td>{bidder.rating.toFixed(1)}/5</td>
                                            <td>
                                                <button
                                                    onClick={() => handleAward(bidder.id)}
                                                    className="btn btn-award"
                                                >
                                                    Award Tender
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No bidders have submitted proposals yet.</p>
                    )}
                </div>
            )}

            <div className="back-link">
                <Link to="/all-tenders">Back to All Tenders</Link>
            </div>
        </div>
    );
};

export default TenderDetail;