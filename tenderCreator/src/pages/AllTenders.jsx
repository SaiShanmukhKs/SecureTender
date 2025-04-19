import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlockchainTendering } from '../context/ContractContext';
import StatusBadge from '../components/StatusBadge';

const AllTenders = () => {
    const [tenders, setTenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const blockchain = useBlockchainTendering();

    useEffect(() => {
        const fetchTenders = async () => {
            try {
                setLoading(true);
                // Get all active tenders from the blockchain
                const activeTenderIds = await blockchain.getActiveTenders();
                console.log(activeTenderIds)
                // Fetch detailed information for each tender
                const tendersData = await Promise.all(
                    activeTenderIds.map(async (tenderId) => {
                        const tenderDetails = await blockchain.getTenderDetails(tenderId);
                        const tenderBids = await blockchain.getTenderBids(tenderId);
                        const isActive = await blockchain.isTenderActive(tenderId);

                        // Format the tender data
                        return {
                            id: tenderId,
                            title: tenderDetails.title,
                            deadline: new Date(Number(tenderDetails.endDate) * 1000).toLocaleDateString(),
                            status: isActive ? "Active" : "Closed",
                            bidders: tenderBids,
                            tenderCreator: tenderDetails.tenderCreator,
                            tenderFee: blockchain.fromWei(tenderDetails.tenderFee),
                            registrationFee: blockchain.fromWei(tenderDetails.registrationFee),
                            rawDetails: tenderDetails
                        };
                    })
                );

                setTenders(tendersData);
            } catch (err) {
                console.error("Error fetching tenders:", err);
                setError("Failed to load tenders. Please check your connection and try again.");
            } finally {
                setLoading(false);
            }
        };

        if (blockchain.account) {
            fetchTenders();
        }
    }, [blockchain.account]);

    if (loading) {
        return <div className="loading">Loading tenders...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="all-tenders container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">All Tenders</h1>

            {tenders.length === 0 ? (
                <div className="no-tenders-message bg-gray-100 p-4 rounded text-center">
                    No active tenders found.
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
                                <th className="py-3 px-4 border-b text-left">Bids</th>
                                <th className="py-3 px-4 border-b text-left">Fee (ETH)</th>
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
                                    <td className="py-2 px-4 border-b">{tender.bidders.length}</td>
                                    <td className="py-2 px-4 border-b">{tender.tenderFee}</td>
                                    <td className="py-2 px-4 border-b">
                                        <Link
                                            to={`/tender/${tender.id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                                        >
                                            View
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

export default AllTenders;