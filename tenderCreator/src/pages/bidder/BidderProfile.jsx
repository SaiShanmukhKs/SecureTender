import React, { useContext, useState, useEffect } from 'react';
import { BidderContext } from '../../context/BidderContext';

function BidderProfile() {
    const { profile, updateProfile, fetchProfile, isLoading, error } = useContext(BidderContext);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });

    // Fetch profile data when component mounts
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Update form data when profile changes
    useEffect(() => {
        if (profile) {
            setFormData({ ...profile });
        }
    }, [profile]);

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

        try {
            const result = await updateProfile(formData);
            if (result) {
                setUpdateStatus({ success: true, message: 'Profile updated successfully!' });
                setEditMode(false);
            } else {
                setUpdateStatus({ success: false, message: 'Failed to update profile.' });
            }
        } catch (err) {
            setUpdateStatus({ success: false, message: `Error: ${err.message}` });
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
                            <p className="registration-number">Registration: {profile.registrationNumber}</p>
                            <div className="rating-display">
                                <span className="rating">{profile.rating.toFixed(1)}</span>
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < Math.round(profile.rating) ? "star filled" : "star"}>★</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setEditMode(true)} className="btn btn-secondary">
                            Edit Profile
                        </button>
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
                                    <span className="info-label">Phone:</span>
                                    <span className="info-value">{profile.phone}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Address:</span>
                                    <span className="info-value">{profile.address}</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h3>Business Categories</h3>
                            <div className="categories-list">
                                {profile.categories.map((category, index) => (
                                    <span key={index} className="category-tag">{category}</span>
                                ))}
                            </div>
                        </div>

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
                    </div>
                </div>
            ) : (
                <form className="profile-edit-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Company Name</label>
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
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            required
                        ></textarea>
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
                            }}
                            className="btn btn-secondary"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default BidderProfile;