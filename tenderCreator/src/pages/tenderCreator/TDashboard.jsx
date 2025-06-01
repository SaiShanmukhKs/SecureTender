import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlockchainTendering } from '../../context/ContractContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { jwtDecode } from 'jwt-decode';

const TDashboard = () => {
    const [tenders, setTenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const blockchain = useBlockchainTendering();

    const token = localStorage.getItem('userData');
    const decodedToken = token ? jwtDecode(token) : null;
    const address = decodedToken ? decodedToken.userResponse.address : null;

    useEffect(() => {
        const fetchTenders = async () => {
            try {
                setLoading(true);
                // Get tenders created by this user
                const createdTenders = await blockchain.getTendersByCreator(address);
                console.log('Dashboard tenders:', createdTenders);

                // Format the tender data
                const tendersData = createdTenders.map((tender) => {
                    // Converting BigInt to regular numbers for display
                    const tenderFeeInWei = typeof tender.tenderFee === 'bigint' ?
                        tender.tenderFee.toString() : tender.tenderFee;

                    const registrationFeeInWei = typeof tender.registrationFee === 'bigint' ?
                        tender.registrationFee.toString() : tender.registrationFee;

                    // Enum mapping: TenderStatus {Closed=0, Open=1, Cancelled=2}
                    const statusMapping = {
                        "0": "Closed",
                        "1": "Open", 
                        "2": "Cancelled"
                    };

                    const statusKey = typeof tender.tenderStatus === 'bigint' ?
                        tender.tenderStatus.toString() : tender.tenderStatus.toString();

                    // Determine if tender is awarded (closed with a winner)
                    const isAwarded = tender.tenderStatus.toString() === "0" && 
                                    tender.winner && 
                                    tender.winner !== "0x0000000000000000000000000000000000000000";

                    return {
                        id: tender.tenderId.toString(),
                        title: tender.title,
                        deadline: new Date(Number(tender.endDate) * 1000).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                        }),
                        status: isAwarded ? "Awarded" : statusMapping[statusKey] || "Unknown",
                        bidders: tender.bidIds ? tender.bidIds.length : 0,
                        tenderFee: blockchain.fromWei ? blockchain.fromWei(tenderFeeInWei) :
                            (tenderFeeInWei / 1e18).toString(),
                        registrationFee: blockchain.fromWei ? blockchain.fromWei(registrationFeeInWei) :
                            (registrationFeeInWei / 1e18).toString(),
                        createdBy: tender.createdBy,
                        winner: tender.winner
                    };
                });

                setTenders(tendersData);
            } catch (err) {
                console.error("Error fetching dashboard tenders:", err);
                setError("Failed to load dashboard data. Please check your connection and try again.");
            } finally {
                setLoading(false);
            }
        };

        if (blockchain.account && address) {
            setTimeout(() => {
                fetchTenders();
            },1000)
        }
    }, [blockchain, blockchain.account, address]);

    // Calculate statistics
    const openTenders = tenders.filter(tender => tender.status === "Open").length;
    const awardedTenders = tenders.filter(tender => tender.status === "Awarded").length;

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h1>Tender Management Dashboard</h1>
            <div className="dashboard-stats">
                <StatCard
                    title="Open Tenders"
                    value={openTenders}
                    linkText="View All"
                    linkTo="/all-tenders"
                />
                <StatCard
                    title="Awarded Tenders"
                    value={awardedTenders}
                    linkText="View All"
                    linkTo="/awarded-tenders"
                />
                <StatCard
                    title="Total Tenders"
                    value={tenders.length}
                    linkText="Create New"
                    linkTo="/create"
                />
            </div>

            <div className="recent-tenders">
                <h2>Recent Tenders</h2>
                {tenders.length === 0 ? (
                    <div className="no-tenders-message bg-gray-100 p-4 rounded text-center">
                        No tenders found. <Link to="/create" className="text-blue-500 hover:underline">Create your first tender</Link>
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
                                    <th className="py-3 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenders.slice(0, 5).map(tender => (
                                    <tr key={tender.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{tender.id}</td>
                                        <td className="py-2 px-4 border-b">{tender.title}</td>
                                        <td className="py-2 px-4 border-b">{tender.deadline}</td>
                                        <td className="py-2 px-4 border-b">
                                            <StatusBadge status={tender.status} />
                                        </td>
                                        <td className="py-2 px-4 border-b">{tender.bidders}</td>
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
        </div>
    );
};

export default TDashboard;