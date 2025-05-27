import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useBlockchainTendering } from '../../context/ContractContext';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function BDashboard() {
    const blockchain = useBlockchainTendering();

    const [dashboardStats, setDashboardStats] = useState({
        openTenders: 0,
        submittedBids: 0,
        awardedBids: 0
    });
    const [tenders, setTenders] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [recommendedTenders, setRecommendedTenders] = useState([]);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to get auth token
    const getAuthToken = () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData).token : null;
    };

    // Helper function to get user address from token
    const getUserAddress = () => {
        try {
            const token = getAuthToken();
            console.log("Auth Token:", token);
            if (!token) return null;
            const decodedToken = jwtDecode(token);
            return decodedToken?.userResponse?.address || null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    // Fetch profile from backend API
    const fetchProfileFromAPI = async () => {
        try {
            const token = getAuthToken();
            if (!token) throw new Error("No auth token found");

            const response = await fetch(`${API_BASE_URL}/api/bidder/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch profile: ${response.status}`);
            }

            const profileData = await response.json();
            return profileData;
        } catch (error) {
            console.error("Error fetching profile from API:", error);
            throw error;
        }
    };

    // Fetch tenders from blockchain
    const fetchTendersData = async () => {
        try {
            const allTenders = await blockchain.getActiveTenders();

            // Transform blockchain data to match expected format
            const transformedTenders = allTenders.map(tender => ({
                id: tender.tenderId,
                title: tender.title,
                description: tender.rfp,
                createdBy: tender.createdBy,
                deadline: new Date(Number(tender.endDate) * 1000).toLocaleDateString(),
                estimatedBudget: blockchain.fromWei(tender.tenderFee),
                status: tender.tenderStatus === 1 ? "Open" : "Closed"
            }));

            
            return transformedTenders;
        } catch (error) {
            console.error("Error fetching tenders:", error);
            throw error;
        }
    };

    // Fetch user's bids from blockchain
    const fetchMyBidsData = async () => {
        try {
            const userAddress = getUserAddress();
            if (!userAddress) throw new Error("User address not found");

            const bids = await blockchain.getBidsByBidder(userAddress);

            // Transform blockchain bid data
            const transformedBids = bids.map(bid => ({
                id: bid.bidId,
                tenderId: bid.tenderId,
                tenderTitle: `Tender #${bid.tenderId}`, // You might want to fetch actual tender titles
                bidAmount: Number(blockchain.fromWei(bid.amount)),
                submissionDate: new Date(Number(bid.issueDate) * 1000).toLocaleDateString(),
                status: bid.status === 0 ? "Submitted" : bid.status === 1 ? "Awarded" : "Rejected"
            }));

            return transformedBids;
        } catch (error) {
            console.error("Error fetching my bids:", error);
            throw error;
        }
    };

    // Initialize dashboard data
    useEffect(() => {
        const initializeDashboard = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch data in parallel
                const [profileData, tendersData, bidsData] = await Promise.all([
                    fetchProfileFromAPI(),
                    fetchTendersData(),
                    fetchMyBidsData()
                ]);
                setTenders(tendersData);
                setProfile(profileData);
                setMyBids(bidsData);

                // Data is already set by individual functions, but we can use the returned data here if needed
                console.log("Dashboard initialized successfully");

            } catch (error) {
                console.error("Error initializing dashboard:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        // Only initialize if blockchain context is ready
        if (blockchain.account) {
            initializeDashboard();
        }
    }, [blockchain, blockchain.account]);

    // Calculate dashboard statistics when data changes
    useEffect(() => {
        if (tenders.length > 0 || myBids.length > 0) {
            const openTendersCount = tenders.filter(tender => tender.status === "Open").length;
            const submittedBidsCount = myBids.filter(bid => bid.status === "Submitted").length;
            const awardedBidsCount = myBids.filter(bid => bid.status === "Awarded").length;

            // Filter tenders for recommendations (open tenders where user hasn't bid)
            const recommendedList = tenders.filter(tender =>
                tender.status === "Open" &&
                !myBids.some(bid => bid.tenderId.toString() === tender.id.toString())
            ).slice(0, 3);

            setDashboardStats({
                openTenders: openTendersCount,
                submittedBids: submittedBidsCount,
                awardedBids: awardedBidsCount
            });

            setRecommendedTenders(recommendedList);
        }
    }, [tenders, myBids]);

    // Refresh data function
    const refreshData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchTendersData(),
                fetchMyBidsData()
            ]);
        } catch (error) {
            console.error("Error refreshing data:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !profile) {
        return <div className="loading">Loading dashboard...</div>;
    }

    if (error && !profile) {
        return <div className="error-message">Error loading dashboard: {error}</div>;
    }

    if (!profile) {
        return <div className="error-message">User profile not found</div>;
    }

    return (
        <div className="dashboard">
            <h1>Welcome, {profile.name}</h1>
            <p className="subtitle">
                Your current rating: 
                <span className="rating">
                    {profile.rating !== -1 ? `${profile.rating.toFixed(1)}/5` : 'Not rated yet'}
                </span>
            </p>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Open Tenders</h3>
                    <p className="stat-value">{dashboardStats.openTenders}</p>
                    <Link to="/tenders" className="stat-link">Browse All</Link>
                </div>
                <div className="stat-card">
                    <h3>My Active Bids</h3>
                    <p className="stat-value">{dashboardStats.submittedBids}</p>
                    <Link to="/my-bids" className="stat-link">View Details</Link>
                </div>
                <div className="stat-card">
                    <h3>Awarded Contracts</h3>
                    <p className="stat-value">{dashboardStats.awardedBids}</p>
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
                                    <span><strong>Budget:</strong> {tender.estimatedBudget} ETH</span>
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
                {myBids.length > 0 ? (
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
                                    <td>{bid.bidAmount.toLocaleString()} ETH</td>
                                    <td>{bid.submissionDate}</td>
                                    <td><span className={`status ${bid.status.toLowerCase()}`}>{bid.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No bid activity to display.</p>
                )}
            </div>

            <div className="refresh-section">
                <button
                    onClick={refreshData}
                    className="btn btn-secondary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    Error: {error}
                </div>
            )}
        </div>
    );
}

export default BDashboard;