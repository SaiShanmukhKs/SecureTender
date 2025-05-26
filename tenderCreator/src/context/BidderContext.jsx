// Bidder Context.jsx
import React, { useState, useEffect, createContext } from 'react';

// Create context
export const BidderContext = createContext();

// API base URL
const API_BASE_URL = 'http://localhost:3000';

export function BidderProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all available tenders
    const fetchTenders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/tenders`);

            if (!response.ok) {
                throw new Error(`Failed to fetch tenders: ${response.status}`);
            }

            const data = await response.json();
            setTenders(data);
            return data;
        } catch (err) {
            setError(err.message);
            console.error("Error fetching tenders:", err);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch bids made by the current user
    const fetchMyBids = async () => {
        try {
            setIsLoading(true);
            // Assuming we have authentication and can get user ID from token or context
            const response = await fetch(`${API_BASE_URL}/bidder/bids`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch your bids: ${response.status}`);
            }

            const data = await response.json();
            setMyBids(data);
            return data;
        } catch (err) {
            setError(err.message);
            console.error("Error fetching bids:", err);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user profile
    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/bidder/profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch profile: ${response.status}`);
            }

            const data = await response.json();
            setProfile(data);
            return data;
        } catch (err) {
            setError(err.message);
            console.error("Error fetching profile:", err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Submit a new bid
    const submitBid = async (tenderId, bidData) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/bidder/bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    tenderId,
                    bidAmount: bidData.bidAmount,
                    notes: bidData.notes
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to submit bid: ${response.status}`);
            }

            const newBid = await response.json();
            setMyBids(prevBids => [...prevBids, newBid]);
            return true;
        } catch (err) {
            setError(err.message);
            console.error("Error submitting bid:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Update profile information
    const updateProfile = async (newProfileData) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/bidder/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(newProfileData)
            });

            if (!response.ok) {
                throw new Error(`Failed to update profile: ${response.status}`);
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            return true;
        } catch (err) {
            setError(err.message);
            console.error("Error updating profile:", err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Get a single tender by ID
    const getTenderById = async (id) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/tenders/${id}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch tender: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message);
            console.error(`Error fetching tender ${id}:`, err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Search tenders by parameters
    const searchTenders = async (searchParams) => {
        try {
            setIsLoading(true);
            const queryString = new URLSearchParams(searchParams).toString();
            const response = await fetch(`${API_BASE_URL}/tenders/search?${queryString}`);

            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message);
            console.error("Error searching tenders:", err);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Load initial data when component mounts
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchTenders(),
                fetchMyBids(),
                fetchProfile()
            ]);
            setIsLoading(false);
        };

        loadInitialData();
    }, []);

    return (
        <BidderContext.Provider value={{
            tenders,
            myBids,
            profile,
            isLoading,
            error,
            fetchTenders,
            fetchMyBids,
            fetchProfile,
            submitBid,
            updateProfile,
            getTenderById,
            searchTenders
        }}>
            {children}
        </BidderContext.Provider>
    );
}