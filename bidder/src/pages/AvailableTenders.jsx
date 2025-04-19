import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BidderContext } from '../contexts/BidderContext';

function AvailableTenders() {
    const { tenders, myBids, fetchTenders, searchTenders, isLoading, error } = useContext(BidderContext);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTenders, setFilteredTenders] = useState([]);
    const [searching, setSearching] = useState(false);

    // Apply filters and search when dependencies change
    useEffect(() => {
        const applyFilters = async () => {
            if (searchTerm.trim().length > 0) {
                setSearching(true);
                try {
                    // Use the search API if there's a search term
                    const searchParams = {
                        query: searchTerm,
                        status: filter !== "all" ? filter : undefined
                    };
                    const results = await searchTenders(searchParams);
                    setFilteredTenders(results);
                } catch (err) {
                    console.error("Error searching tenders:", err);
                } finally {
                    setSearching(false);
                }
            } else {
                // Just filter the existing tenders if no search term
                const filtered = tenders.filter(tender => {
                    return filter === "all" || tender.status.toLowerCase() === filter.toLowerCase();
                });
                setFilteredTenders(filtered);
            }
        };

        applyFilters();
    }, [filter, searchTerm, tenders, searchTenders]);

    // Refresh data when component mounts
    useEffect(() => {
        fetchTenders();
    }, [fetchTenders]);

    // Delayed search to prevent too many API calls
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchTerm.trim().length > 0) {
                const searchParams = {
                    query: searchTerm,
                    status: filter !== "all" ? filter : undefined
                };
                searchTenders(searchParams);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, filter, searchTenders]);

    // Check if the user has already bid on a tender
    const hasBid = (tenderId) => {
        return myBids.some(bid => bid.tenderId === tenderId);
    };

    if (isLoading && !searching) {
        return <div className="loading">Loading tenders...</div>;
    }

    if (error && !searching) {
        return <div className="error-message">Error loading tenders: {error}</div>;
    }

    return (
        <div className="available-tenders">
            <h1>Available Tenders</h1>

            <div className="filter-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search tenders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searching && <span className="searching-indicator">Searching...</span>}
                </div>

                <div className="filter-buttons">
                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>
                    <button
                        className={filter === "open" ? "active" : ""}
                        onClick={() => setFilter("open")}
                    >
                        Open
                    </button>
                    <button
                        className={filter === "closed" ? "active" : ""}
                        onClick={() => setFilter("closed")}
                    >
                        Closed
                    </button>
                </div>
            </div>

            <div className="tender-list">
                {filteredTenders.length > 0 ? (
                    filteredTenders.map(tender => (
                        <div key={tender.id} className="tender-item">
                            <div className="tender-header">
                                <h3>{tender.title}</h3>
                                <span className={`status ${tender.status.toLowerCase()}`}>{tender.status}</span>
                            </div>

                            <p className="tender-description">{tender.description}</p>

                            <div className="tender-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Created by:</span>
                                    <span className="meta-value">{tender.createdBy}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Deadline:</span>
                                    <span className="meta-value">{tender.deadline}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Est. Budget:</span>
                                    <span className="meta-value">${tender.estimatedBudget}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Category:</span>
                                    <span className="meta-value">{tender.category}</span>
                                </div>
                            </div>

                            <div className="tender-actions">
                                <Link to={`/tender/${tender.id}`} className="btn btn-secondary">View Details</Link>
                                {tender.status === "Open" && !hasBid(tender.id) && (
                                    <Link to={`/submit-bid/${tender.id}`} className="btn btn-primary">Submit Bid</Link>
                                )}
                                {hasBid(tender.id) && (
                                    <span className="bid-submitted">Bid Submitted</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No tenders match your criteria.</p>
                )}
            </div>

            <div className="refresh-section">
                <button onClick={() => fetchTenders()} className="btn btn-secondary">
                    Refresh Tenders
                </button>
            </div>
        </div>
    );
}

export default AvailableTenders;