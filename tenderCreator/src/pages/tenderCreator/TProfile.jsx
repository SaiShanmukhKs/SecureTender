import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TProfile.css';


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function TProfile() {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to get auth token
    const getAuthToken = () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData).token : null;
    };

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('userData');
        window.location.href = '/'; // Redirect to login page
    };

    // Fetch profile from backend API
    const fetchProfile = React.useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = getAuthToken();
            if (!token) {
                throw new Error("No auth token found");
            }

            const response = await axios.get(`${API_BASE_URL}/api/tendercreator/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setProfile(response.data);
            console.log("Fetched profile data:", response.data);
            setFormData({ ...response.data });
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError(error.response?.data?.error || error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update profile via backend API
    const updateProfile = async (updatedData) => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("No auth token found");
            }

            console.log("Updating profile with data:", updatedData);
            console.log("Using token:", token);

            const response = await axios.put(`${API_BASE_URL}/api/tendercreator/profile`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setProfile(response.data);
            return true;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw new Error(error.response?.data?.error || error.message);
        }
    };

    // Fetch profile data when component mounts
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatus({ success: false, message: '' });
        setIsLoading(true);

        try {
            await updateProfile(formData);
            setUpdateStatus({ success: true, message: 'Profile updated successfully!' });
            setEditMode(false);
        } catch (err) {
            setUpdateStatus({ success: false, message: `Error: ${err.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !profile) {
        return <div className="loading">Loading profile...</div>;
    }

    if (error && !profile) {
        return <div className="error-message">Error loading profile: {error}</div>;
    }

    if (!profile) {
        return <div className="error-message">Profile not found</div>;
    }

    return (
        <div className="bidder-profile">
            <h1>My Profile</h1>

            {updateStatus.message && (
                <div className={`alert ${updateStatus.success ? 'alert-success' : 'alert-error'}`}>
                    {updateStatus.message}
                </div>
            )}

            {!editMode ? (
                <div className="profile-view">
                    <div className="profile-header">
                        <div className="profile-main">
                            <h2>{profile.name}</h2>
                            <p className="registration-number">Company: {profile.companyName}</p>
                            <p className="wallet-address">Wallet: {profile.walletAddress}</p>
                            {profile.rating && profile.rating !== -1 && (
                                <div className="rating-display">
                                    <span className="rating">{profile.rating.toFixed(1)}</span>
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < Math.round(profile.rating) ? "star filled" : "star"}>★</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="corner-buttons">
                            <button onClick={handleLogout} className="btn btn-logout">
                                Logout
                            </button>
                            <button onClick={() => setEditMode(true)} className="btn btn-secondary">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="profile-sections">
                        <div className="profile-section">
                            <h3>Contact Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{profile.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Company Name:</span>
                                    <span className="info-value">{profile.companyName}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Wallet Address:</span>
                                    <span className="info-value">{profile.walletAddress}</span>
                                </div>
                            </div>
                        </div>

                        {profile.categories && profile.categories.length > 0 && (
                            <div className="profile-section">
                                <h3>Business Categories</h3>
                                <div className="categories-list">
                                    {profile.categories.map((category, index) => (
                                        <span key={index} className="category-tag">{category}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {profile.documents && profile.documents.length > 0 && (
                            <div className="profile-section">
                                <h3>Documents</h3>
                                <ul className="document-list">
                                    {profile.documents.map((doc, index) => (
                                        <li key={index}>
                                            <span className="document-icon">📄</span>
                                            <span className="document-name">{doc}</span>
                                            <button className="btn btn-sm">View</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <form className="profile-edit-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="walletAddress">Wallet Address</label>
                        <input
                            type="text"
                            id="walletAddress"
                            name="walletAddress"
                            value={formData.walletAddress || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({ ...profile });
                                setEditMode(false);
                                setUpdateStatus({ success: false, message: '' });
                            }}
                            className="btn btn-secondary"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {isLoading && profile && (
                <div className="loading-overlay">
                    <div className="loading">Updating profile...</div>
                </div>
            )}
        </div>
    );
}

export default TProfile;