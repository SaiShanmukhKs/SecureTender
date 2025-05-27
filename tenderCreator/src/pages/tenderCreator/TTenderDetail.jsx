import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlockchainTendering } from '../../context/ContractContext';
import StatusBadge from '../../components/StatusBadge';
import useParams from '../../hooks/useParams';
import axios from 'axios';

const TTenderDetail = () => {
    const [tender, setTender] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidderInfo, setBidderInfo] = useState({});
    const [error, setError] = useState(null);
    const blockchain = useBlockchainTendering();
    const navigate = useNavigate();
    const { id } = useParams();
    const tenderId = parseInt(id);

    const getAuthToken = () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData).token : null;
    };

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
                const bidDetails = await blockchain.getBidsForTender(tenderId);
                setTender(tenderDetails);
                setBids(bidDetails);

                const token = getAuthToken();
                const infoMap = {};

                await Promise.all(bidDetails.map(async (bid) => {
                    try {
                        const backendUrl = import.meta.env.VITE_BACKEND_URL;
                        const res = await axios.get(
                            backendUrl + `/api/tendercreator/bidderDetails`,
                            {
                                params: { address: bid.createdBy },
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        infoMap[bid.createdBy] = res.data;
                    } catch (err) {
                        console.error("Failed to fetch bidder info:", err);
                        infoMap[bid.createdBy] = { name: "Unknown", rating: "-" };
                    }
                }));

                setBidderInfo(infoMap);
                setError(null);
            } catch (error) {
                console.error("Error fetching tender details:", error);
                setError("Failed to load tender details.");
            } finally {
                setLoading(false);
            }
        };

        fetchTenderDetails();
    }, [blockchain, tenderId]);

    if (loading) return <div className="no-results">Loading tender details...</div>;
    if (error) return <div className="no-results">{error}</div>;
    if (!tender) return <div className="no-results">Tender not found</div>;

    const sortedBidders = bids.sort((a, b) => a.amount - b.amount);

    const handleAward = (bidderAddress) => {
        blockchain.awardTender(tenderId, bidderAddress);
        navigate("/awarded-tenders");
    };

    const isValidAddress = (address) =>
        address && address.toLowerCase() !== '0x0000000000000000000000000000000000000000';

    const awardedBidderAddress = tender.winner;
    const awardedBidder = isValidAddress(awardedBidderAddress)
        ? {
            address: awardedBidderAddress,
            ...bidderInfo[awardedBidderAddress]
        }
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
                        <div className="detail-item">
                            <strong>Vendor</strong>
                            <p>{awardedBidder.name || awardedBidder.address}</p>
                        </div>
                        <div className="detail-item">
                            <strong>Bid Amount</strong>
                            <p>
                                {bids.find(b => b.createdBy === awardedBidder.address)
                                    ? blockchain.fromWei(bids.find(b => b.createdBy === awardedBidder.address).amount)
                                    : "-"}
                            </p>
                        </div>
                        <div className="detail-item">
                            <strong>Rating</strong>
                            <p>
                                {awardedBidder.rating !== undefined
                                    ? `${awardedBidder.rating.toFixed(1)}/5`
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {statusMapping[getStatusKey(tender.tenderStatus)] === "Open" && (
                <div className="detail-section">
                    <h3>Top 3 Bidders</h3>
                    {tender.bidIds.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Bid Amount</th>
                                    <th>Rating</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedBidders.slice(0, 3).map((bidder, index) => (
                                    <tr key={bidder.bidId}>
                                        <td>{index + 1}</td>
                                        <td>{bidderInfo[bidder.createdBy]?.name || bidder.createdBy}</td>
                                        <td>
                                            {blockchain.fromWei
                                                ? blockchain.fromWei(bidder.amount)
                                                : (bidder.amount / 1e18).toString()}
                                        </td>
                                        <td>{bidderInfo[bidder.createdBy]?.rating?.toFixed(1) ?? '-'}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleAward(bidder.createdBy)}
                                            >
                                                Award Tender
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No bidders have submitted proposals yet.</p>
                    )}
                </div>
            )}

            <div className="form-actions">
                <Link to="/all-tenders" className="btn btn-secondary">Back to All Tenders</Link>
            </div>
        </div>
    );
};

export default TTenderDetail;
