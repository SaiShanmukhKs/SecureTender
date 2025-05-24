import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TenderContext } from '../../context/TenderContext';

const AwardedTenders = () => {
    const { tenders } = useContext(TenderContext);
    const awardedTenders = tenders.filter(tender => tender.status === "Awarded");

    return (
        <div className="awarded-tenders">
            <h1>Awarded Tenders</h1>
            {awardedTenders.length === 0 ? (
                <p>No tenders have been awarded yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Deadline</th>
                            <th>Awarded To</th>
                            <th>Bid Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {awardedTenders.map(tender => {
                            const awardedBidder = tender.bidders.find(bidder => bidder.id === tender.awardedTo);
                            return (
                                <tr key={tender.id}>
                                    <td>{tender.id}</td>
                                    <td>{tender.title}</td>
                                    <td>{tender.deadline}</td>
                                    <td>{awardedBidder ? awardedBidder.name : "N/A"}</td>
                                    <td>${awardedBidder ? awardedBidder.bid.toLocaleString() : "N/A"}</td>
                                    <td>
                                        <Link to={`/tender/${tender.id}`} className="btn btn-view">View</Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AwardedTenders;