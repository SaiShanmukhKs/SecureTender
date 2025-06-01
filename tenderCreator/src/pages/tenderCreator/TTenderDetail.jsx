import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlockchainTendering } from '../../context/ContractContext';
import StatusBadge from '../../components/StatusBadge';
import useParams from '../../hooks/useParams';
import axios from 'axios';
import './TTenderDetail.css'; // Assuming you have a CSS file for styling

const TTenderDetail = () => {
    const [tender, setTender] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [awarding, setAwarding] = useState(false);
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

    const handleAward = async (bidderAddress) => {
        // Add confirmation dialog
        const bidderName = bidderInfo[bidderAddress]?.name || bidderAddress;
        if (!window.confirm(`Are you sure you want to award this tender to ${bidderName}?`)) {
            return;
        }

        try {
            setAwarding(true);
            setError(null);
            
            // Find the winning bid to get the bid amount
            const winningBid = bids.find(bid => bid.createdBy === bidderAddress);
            if (!winningBid) {
                setError("Could not find the selected bid");
                return;
            }

            // Convert bid amount from Wei to Ether for the setWinner function
            const winningBidAmountInEther = blockchain.fromWei(winningBid.amount);
            
            console.log("Awarding tender to:", bidderAddress);
            console.log("Winning bid amount (ETH):", winningBidAmountInEther);

            // Call setWinner with the required parameters
            const result = await blockchain.setWinner(tenderId, bidderAddress, winningBidAmountInEther);
            
            if (result) {
                console.log("Tender awarded successfully:", result);
                // Refresh the tender details to show the updated state
                const updatedTenderDetails = await blockchain.getTenderDetails(tenderId);
                setTender(updatedTenderDetails);
                
                // Show success message
                alert(`Tender successfully awarded to ${bidderName}!`);
            } else {
                setError("Failed to award tender. Please try again.");
            }
        } catch (error) {
            console.error("Error awarding tender:", error);
            setError(`Error awarding tender: ${error.message}`);
        } finally {
            setAwarding(false);
        }
    };

    const handlePayBidder = () => {
        navigate(`/paybidder/${tenderId}`);
    };

    if (loading) return <div className="no-results">Loading tender details...</div>;
    if (error && !tender) return <div className="no-results">{error}</div>;
    if (!tender) return <div className="no-results">Tender not found</div>;

    const sortedBidders = bids.sort((a, b) => Number(a.amount) - Number(b.amount));

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
        <div className="tender-detail-page content">
            <div className="detail-header">
                <h1>{tender.title}</h1>
                <StatusBadge status={statusMapping[getStatusKey(tender.tenderStatus)]} />
            </div>

            {error && (
                <div className="alert alert-error" style={{ margin: '20px 0' }}>
                    {error}
                    <button 
                        onClick={() => setError(null)} 
                        style={{ float: 'right', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                    >
                        ×
                    </button>
                </div>
            )}

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
                    <div className="detail-item">
                        <strong>Tender Fee</strong>
                        <p>{blockchain.fromWei ? blockchain.fromWei(tender.tenderFee) : (tender.tenderFee / 1e18).toString()} ETH</p>
                    </div>
                    <div className="detail-item">
                        <strong>Registration Fee</strong>
                        <p>{blockchain.fromWei ? blockchain.fromWei(tender.registrationFee) : (tender.registrationFee / 1e18).toString()} ETH</p>
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
                                    ? `${blockchain.fromWei(bids.find(b => b.createdBy === awardedBidder.address).amount)} ETH`
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
                        <div className="detail-item">
                            <strong>Contact</strong>
                            <p>{awardedBidder.email || "-"}</p>
                        </div>
                    </div>
                    <div className="form-actions" style={{ marginTop: '20px' }}>
                        <button 
                            className="btn btn-success"
                            onClick={handlePayBidder}
                        >
                            Pay Bidder
                        </button>
                    </div>
                </div>
            )}

            {statusMapping[getStatusKey(tender.tenderStatus)] === "Open" && (
                <div className="detail-section">
                    <h3>Top 3 Bidders</h3>
                    {tender.bidIds && tender.bidIds.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Bid Amount (ETH)</th>
                                        <th>Rating</th>
                                        <th>Details</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedBidders.slice(0, 3).map((bidder, index) => (
                                        <tr key={bidder.bidId}>
                                            <td>#{index + 1}</td>
                                            <td>{bidderInfo[bidder.createdBy]?.name || bidder.createdBy}</td>
                                            <td>
                                                {blockchain.fromWei
                                                    ? blockchain.fromWei(bidder.amount)
                                                    : (bidder.amount / 1e18).toString()}
                                            </td>
                                            <td>
                                                {bidderInfo[bidder.createdBy]?.rating 
                                                    ? `${bidderInfo[bidder.createdBy].rating.toFixed(1)}/5`
                                                    : '-'}
                                            </td>
                                            <td>
                                                <div className="bid-details">
                                                    {bidder.detailsFile && bidder.detailsFile.length > 50 
                                                        ? `${bidder.detailsFile.substring(0, 50)}...`
                                                        : bidder.detailsFile || "No details provided"}
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleAward(bidder.createdBy)}
                                                    disabled={awarding}
                                                >
                                                    {awarding ? 'Awarding...' : 'Award Tender'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>No bidders have submitted proposals yet.</p>
                        </div>
                    )}
                </div>
            )}

            {statusMapping[getStatusKey(tender.tenderStatus)] === "Open" && sortedBidders.length > 3 && (
                <div className="detail-section">
                    <h3>All Other Bids ({sortedBidders.length - 3})</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Bid Amount (ETH)</th>
                                    <th>Rating</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedBidders.slice(3).map((bidder, index) => (
                                    <tr key={bidder.bidId}>
                                        <td>#{index + 4}</td>
                                        <td>{bidderInfo[bidder.createdBy]?.name || bidder.createdBy}</td>
                                        <td>
                                            {blockchain.fromWei
                                                ? blockchain.fromWei(bidder.amount)
                                                : (bidder.amount / 1e18).toString()}
                                        </td>
                                        <td>
                                            {bidderInfo[bidder.createdBy]?.rating 
                                                ? `${bidderInfo[bidder.createdBy].rating.toFixed(1)}/5`
                                                : '-'}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleAward(bidder.createdBy)}
                                                disabled={awarding}
                                            >
                                                {awarding ? 'Awarding...' : 'Award Tender'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="form-actions">
                <Link to="/all-tenders" className="btn btn-secondary">Back to All Tenders</Link>
                {awardedBidder && (
                    <Link to="/awarded-tenders" className="btn btn-info" style={{ marginLeft: '10px' }}>
                        View Awarded Tenders
                    </Link>
                )}
            </div>
        </div>
    );
};

export default TTenderDetail;