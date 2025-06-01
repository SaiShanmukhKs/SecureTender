import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlockchainTendering } from '../../context/ContractContext';
import StatusBadge from '../../components/StatusBadge';
import { jwtDecode } from 'jwt-decode';

const AwardedTenders = () => {
    const [tenders, setTenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const blockchain = useBlockchainTendering();

    const token = localStorage.getItem('userData');
    const decodedToken = token ? jwtDecode(token) : null;
    const address = decodedToken ? decodedToken.userResponse.address : null;

    useEffect(() => {
        const fetchAwardedTenders = async () => {
            try {
                setLoading(true);
                // Get awarded tenders for the current user
                const awardedTenders = await blockchain.getAwardedTenders(address);
                console.log('Awarded tenders:', awardedTenders);

                // Format the tender data and fetch additional details
                const tendersData = await Promise.all(awardedTenders.map(async (tender) => {
                    try {
                        // Converting BigInt to regular numbers for display
                        const tenderFeeInWei = typeof tender.tenderFee === 'bigint' ?
                            tender.tenderFee.toString() : tender.tenderFee;

                        const registrationFeeInWei = typeof tender.registrationFee === 'bigint' ?
                            tender.registrationFee.toString() : tender.registrationFee;

                        // Get the winning bid details
                        let winnerBid = null;
                        let winnerBidAmount = 0;
                        
                        if (tender.winner && tender.winner !== "0x0000000000000000000000000000000000000000") {
                            try {
                                // Get all bids for this tender to find the winner's bid
                                const bids = await blockchain.getBidsForTender(tender.tenderId);
                                winnerBid = bids.find(bid => 
                                    bid.createdBy.toLowerCase() === tender.winner.toLowerCase() && 
                                    bid.status.toString() === "1" // BidStatus.Accepted = 1
                                );
                                
                                if (winnerBid) {
                                    winnerBidAmount = typeof winnerBid.amount === 'bigint' ?
                                        blockchain.fromWei(winnerBid.amount.toString()) :
                                        blockchain.fromWei(winnerBid.amount);
                                }
                            } catch (bidError) {
                                console.error("Error fetching winner bid details:", bidError);
                            }
                        }

                        return {
                            id: tender.tenderId.toString(),
                            title: tender.title,
                            deadline: new Date(Number(tender.endDate) * 1000).toLocaleDateString('en-GB', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric' 
                            }),
                            status: "Awarded",
                            bidders: tender.bidIds ? tender.bidIds.length : 0,
                            tenderFee: blockchain.fromWei ? blockchain.fromWei(tenderFeeInWei) :
                                (tenderFeeInWei / 1e18).toString(),
                            registrationFee: blockchain.fromWei ? blockchain.fromWei(registrationFeeInWei) :
                                (registrationFeeInWei / 1e18).toString(),
                            createdBy: tender.createdBy,
                            winner: tender.winner,
                            winnerBidAmount: winnerBidAmount,
                            winnerBid: winnerBid
                        };
                    } catch (mappingError) {
                        console.error("Error mapping tender data:", mappingError);
                        return null;
                    }
                }));

                // Filter out any null entries from failed mappings
                const validTendersData = tendersData.filter(tender => tender !== null);
                
                console.log("Processed awarded tenders data:", validTendersData);
                setTenders(validTendersData);
            } catch (err) {
                console.error("Error fetching awarded tenders:", err);
                setError("Failed to load awarded tenders. Please check your connection and try again.");
            } finally {
                setLoading(false);
            }
        };

        if (blockchain.account && address) {
            fetchAwardedTenders();
        }
    }, [blockchain, blockchain.account, address]);

    const formatAddress = (address) => {
        if (!address) return "N/A";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    if (loading) {
        return <div className="loading">Loading awarded tenders...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="awarded-tenders container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Awarded Tenders</h1>

            {tenders.length === 0 ? (
                <div className="no-tenders-message bg-gray-100 p-4 rounded text-center">
                    No tenders have been awarded yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left">ID</th>
                                <th className="py-3 px-4 border-b text-left">Title</th>
                                <th className="py-3 px-4 border-b text-left">Deadline</th>
                                <th className="py-3 px-4 border-b text-left">Status</th>
                                <th className="py-3 px-4 border-b text-left">Winner Address</th>
                                <th className="py-3 px-4 border-b text-left">Winning Bid (ETH)</th>
                                <th className="py-3 px-4 border-b text-left">Total Bids</th>
                                <th className="py-3 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenders.map(tender => (
                                <tr key={tender.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{tender.id}</td>
                                    <td className="py-2 px-4 border-b">{tender.title}</td>
                                    <td className="py-2 px-4 border-b">{tender.deadline}</td>
                                    <td className="py-2 px-4 border-b">
                                        <StatusBadge status={tender.status} />
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <span title={tender.winner}>
                                            {formatAddress(tender.winner)}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {tender.winnerBidAmount ? 
                                            `${parseFloat(tender.winnerBidAmount).toFixed(4)} ETH` : 
                                            "N/A"
                                        }
                                    </td>
                                    <td className="py-2 px-4 border-b">{tender.bidders}</td>
                                    <td className="py-2 px-4 border-b">
                                        <Link
                                            to={`/tender/${tender.id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm mr-2"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            to={`/paybidder/${tender.id}`}
                                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                                        >
                                            Payments
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AwardedTenders;