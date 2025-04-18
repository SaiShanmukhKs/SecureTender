import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BidderContext } from '../contexts/BidderContext';

function Dashboard() {
    const { tenders, myBids, profile } = useContext(BidderContext);

    const openTenders = tenders.filter(tender => tender.status === "Open").length;
    const submittedBids = myBids.filter(bid => bid.status === "Submitted").length;
    const awardedBids = myBids.filter(bid => bid.status === "Awarded").length;

    // Filter tenders by profile categories (matching)
    const recommendedTenders = tenders.filter(tender =>
        tender.status === "Open" && !myBids.some(bid => bid.tenderId === tender.id)
    ).slice(0, 3);

    return (
        <div className="dashboard">
            <h1>Welcome, {profile.name}</h1>
            <p className="subtitle">Your current rating: <span className="rating">{profile.rating.toFixed(1)}/5</span></p>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Open Tenders</h3>
                    <p className="stat-value">{openTenders}</p>
                    <Link to="/tenders" className="stat-link">Browse All</Link>
                </div>
                <div className="stat-card">
                    <h3>My Active Bids</h3>
                    <p className="stat-value">{submittedBids}</p>
                    <Link to="/my-bids" className="stat-link">View Details</Link>
                </div>
                <div className="stat-card">
                    <h3>Awarded Contracts</h3>
                    <p className="stat-value">{awardedBids}</p>
                    <Link to="/my-bids" className="stat-link">View All</Link>
                </div>
            </div>

            <div className="recommendations">
                <h2>Recommended Tenders</h2>
                {recommendedTenders.length > 0 ? (
                    <div className="tender-cards">
                        {recommendedTenders.map(tender => (
                            <div key={tender.id} className="tender-card">
                                <h3>{tender.title}</h3>
                                <p className="tender-description">{tender.description}</p>
                                <div className="tender-details">
                                    <span><strong>Created by:</strong> {tender.createdBy}</span>
                                    <span><strong>Deadline:</strong> {tender.deadline}</span>
                                    <span><strong>Budget:</strong> ${tender.estimatedBudget}</span>
                                </div>
                                <Link to={`/tender/${tender.id}`} className="btn btn-primary">View Details</Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No recommended tenders found at this time.</p>
                )}
            </div>

            <div className="recent-activity">
                <h2>Recent Bid Activity</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Tender</th>
                            <th>Bid Amount</th>
                            <th>Submission Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myBids.slice(0, 5).map(bid => (
                            <tr key={bid.id}>
                                <td>{bid.tenderTitle}</td>
                                <td>${bid.bidAmount.toLocaleString()}</td>
                                <td>{bid.submissionDate}</td>
                                <td><span className={`status ${bid.status.toLowerCase()}`}>{bid.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;