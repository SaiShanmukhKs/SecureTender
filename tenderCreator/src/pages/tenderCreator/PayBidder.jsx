import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlockchainTendering } from '../../context/ContractContext';
import useParams from '../../hooks/useParams';
import axios from 'axios';
import './PayBidder.css'; // Assuming you have a CSS file for styling

const PayBidder = () => {
    const [tender, setTender] = useState(null);
    const [phases, setPhases] = useState([]);
    const [bidAmount, setBidAmount] = useState(0);
    const [phaseAmounts, setPhaseAmounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState({});
    const [bidderInfo, setBidderInfo] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const blockchain = useBlockchainTendering();
    const { id } = useParams();
    const tenderid = parseInt(id);
    
    // Fix 1: Add validation and conversion for tender ID
    const tenderId = React.useMemo(() => {
        const parsed = parseInt(tenderid);
        if (isNaN(parsed) || parsed <= 0) {
            console.error("Invalid tender ID:", tenderid);
            return null;
        }
        return parsed;
    }, [tenderid]);

    const getAuthToken = () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData).token : null;
    };

    // Check if all phases are completed
    const areAllPhasesPaid = () => {
        return phases.length > 0 && phases.every(phase => phase.isPaid);
    };

    useEffect(() => {
        // Fix 2: Early return if tender ID is invalid
        if (!tenderId) {
            setError("Invalid tender ID provided.");
            setLoading(false);
            return;
        }

        const fetchTenderAndPhaseDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fix 3: Wait for blockchain context to be ready
                if (!blockchain.contract || !blockchain.web3 || !blockchain.account) {
                    console.log("Blockchain context not ready yet, retrying...");
                    setTimeout(fetchTenderAndPhaseDetails, 1000);
                    return;
                }

                console.log("Fetching tender details for ID:", tenderId);
                
                // Get tender details
                const tenderDetails = await blockchain.getTenderDetails(tenderId);
                console.log("Tender details:", tenderDetails);
                setTender(tenderDetails);

                // Check if tender has a winner
                const isValidAddress = (address) =>
                    address && 
                    address.toLowerCase() !== '0x0000000000000000000000000000000000000000' &&
                    address !== '0x0000000000000000000000000000000000000000';

                if (!isValidAddress(tenderDetails.winner)) {
                    setError("No winner has been selected for this tender yet.");
                    return;
                }

                // Get phase information
                console.log("Fetching phase info...");
                const phaseInfo = await blockchain.getPhaseInfo(tenderId);
                console.log("Phase info:", phaseInfo);
                
                // Fix 4: Handle phase info structure properly
                // The getPhaseInfo returns individual values, not an array of phases
                const phaseData = {
                    totalPhases: parseInt(phaseInfo.totalPhases),
                    completedPhases: parseInt(phaseInfo.completedPhases),
                    remainingPhases: parseInt(phaseInfo.remainingPhases),
                    totalAmount: phaseInfo.totalAmount,
                    dispersedAmount: phaseInfo.dispersedAmount,
                    remainingAmount: phaseInfo.remainingAmount,
                    amountPerPhase: phaseInfo.amountPerPhase,
                    fundsDeposited: phaseInfo.fundsDeposited
                };

                // Create phase array based on total phases
                const phasesArray = [];
                for (let i = 0; i < phaseData.totalPhases; i++) {
                    phasesArray.push({
                        index: i,
                        description: `Phase ${i + 1}`,
                        isPaid: i < phaseData.completedPhases,
                        amount: phaseData.amountPerPhase
                    });
                }
                setPhases(phasesArray);

                // Get the winning bid amount
                console.log("Fetching bids...");
                const bids = await blockchain.getBidsForTender(tenderId);
                const winningBid = bids.find(bid => 
                    bid.createdBy.toLowerCase() === tenderDetails.winner.toLowerCase()
                );
                
                if (winningBid) {
                    const bidAmountInEth = parseFloat(blockchain.fromWei(winningBid.amount));
                    setBidAmount(bidAmountInEth);
                    
                    // Calculate phase amounts (divide equally among phases)
                    const amountPerPhase = bidAmountInEth / phaseData.totalPhases;
                    setPhaseAmounts(phasesArray.map(() => amountPerPhase));
                } else {
                    // Fallback to total amount from contract
                    const totalAmountInEth = parseFloat(blockchain.fromWei(phaseData.totalAmount));
                    setBidAmount(totalAmountInEth);
                    const amountPerPhase = totalAmountInEth / phaseData.totalPhases;
                    setPhaseAmounts(phasesArray.map(() => amountPerPhase));
                }

                // Get bidder information
                const token = getAuthToken();
                if (token) {
                    try {
                        const backendUrl = import.meta.env.VITE_BACKEND_URL;
                        const res = await axios.get(
                            `${backendUrl}/api/tendercreator/bidderDetails`,
                            {
                                params: { address: tenderDetails.winner },
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        setBidderInfo(res.data);
                    } catch (err) {
                        console.error("Failed to fetch bidder info:", err);
                        setBidderInfo({ name: "Unknown", rating: "-" });
                    }
                } else {
                    setBidderInfo({ name: "Unknown", rating: "-" });
                }

            } catch (error) {
                console.error("Error fetching tender and phase details:", error);
                setError(`Failed to load tender and phase details: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchTenderAndPhaseDetails();
    }, [blockchain, tenderId]);

    const handlePhasePayment = async (phaseIndex) => {
        if (!blockchain.contract || !blockchain.web3 || !blockchain.account) {
            alert("Blockchain connection not ready. Please try again.");
            return;
        }

        try {
            setPaymentLoading(prev => ({ ...prev, [phaseIndex]: true }));
            
            console.log(`Processing payment for phase ${phaseIndex + 1}`);
            
            // Call the contract method to disperse funds for this phase
            const result = await blockchain.disperseFunds(tenderId);
            console.log("Dispersal result:", result);
            
            alert(`Payment for Phase ${phaseIndex + 1} completed successfully!`);
            
            // Refresh the page data after payment
            window.location.reload();
            
        } catch (error) {
            console.error("Error processing phase payment:", error);
            let errorMessage = "Failed to process payment. Please try again.";
            
            // Handle specific error cases
            if (error.message.includes("revert")) {
                if (error.message.includes("All phases completed")) {
                    errorMessage = "All phases have already been completed.";
                } else if (error.message.includes("Insufficient contract balance")) {
                    errorMessage = "Insufficient funds in the contract.";
                } else if (error.message.includes("Only tender creator allowed")) {
                    errorMessage = "Only the tender creator can make payments.";
                }
            }
            
            alert(errorMessage);
        } finally {
            setPaymentLoading(prev => ({ ...prev, [phaseIndex]: false }));
        }
    };

    const handleCustomAmountChange = (phaseIndex, newAmount) => {
        const updatedAmounts = [...phaseAmounts];
        updatedAmounts[phaseIndex] = parseFloat(newAmount) || 0;
        setPhaseAmounts(updatedAmounts);
    };

    const getTotalCustomAmount = () => {
        return phaseAmounts.reduce((sum, amount) => sum + amount, 0);
    };

    const handleStarClick = (starValue) => {
        setRating(starValue);
    };

    const handleStarHover = (starValue) => {
        setHoveredStar(starValue);
    };

    const handleStarLeave = () => {
        setHoveredStar(0);
    };

    const submitRating = async () => {
        if (rating === 0) {
            alert("Please select a rating before submitting.");
            return;
        }

        const token = getAuthToken();
        if (!token) {
            alert("Authentication required. Please log in again.");
            return;
        }

        if (!bidderInfo?.id) {
            alert("Bidder information not available. Cannot submit rating.");
            return;
        }

        try {
            setIsSubmittingRating(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            const response = await axios.put(
                `${backendUrl}/api/tendercreator/rateBidder`,
                {
                    bidderAddress: tender.winner,
                    rating: rating
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                alert("Rating submitted successfully!");
                setHasRated(true);
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
            let errorMessage = "Failed to submit rating. Please try again.";
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }
            
            alert(errorMessage);
        } finally {
            setIsSubmittingRating(false);
        }
    };

    // Fix 5: Better loading and error states
    if (loading) {
        return (
            <div className="pay-bidder-page content">
                <div className="no-results">
                    Loading payment details...
                    <br />
                    <small>Initializing blockchain connection...</small>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="pay-bidder-page content">
                <div className="no-results">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <div className="form-actions">
                        <Link to="/all-tenders" className="btn btn-secondary">
                            Back to All Tenders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!tender) {
        return (
            <div className="pay-bidder-page content">
                <div className="no-results">
                    Tender not found
                    <div className="form-actions">
                        <Link to="/all-tenders" className="btn btn-secondary">
                            Back to All Tenders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pay-bidder-page content">
            <div className="detail-header">
                <h1>Pay Bidder - {tender.title}</h1>
            </div>

            <div className="detail-section">
                <h3>Bidder Information</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <strong>Bidder Name</strong>
                        <p>{bidderInfo?.name || "Loading..."}</p>
                    </div>
                    <div className="detail-item">
                        <strong>Bidder Address</strong>
                        <p>{tender.winner}</p>
                    </div>
                    <div className="detail-item">
                        <strong>Total Bid Amount</strong>
                        <p>{bidAmount.toFixed(4)} ETH</p>
                    </div>
                    <div className="detail-item">
                        <strong>Rating</strong>
                        <p>
                            {bidderInfo?.rating !== undefined
                                ? `${bidderInfo.rating.toFixed(1)}/5`
                                : "Loading..."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h3>Phase-wise Payment</h3>
                <div className="phase-payment-summary">
                    <p><strong>Total Amount:</strong> {bidAmount.toFixed(4)} ETH</p>
                    <p><strong>Number of Phases:</strong> {phases.length}</p>
                    <p><strong>Custom Total:</strong> {getTotalCustomAmount().toFixed(4)} ETH</p>
                    {Math.abs(getTotalCustomAmount() - bidAmount) > 0.0001 && (
                        <p className="warning">
                            <strong>Warning:</strong> Custom amounts do not match the total bid amount!
                        </p>
                    )}
                </div>

                {phases.length > 0 ? (
                    <div className="phases-container">
                        {phases.map((phase, index) => (
                            <div key={index} className="phase-card">
                                <div className="phase-header">
                                    <h4>Phase {index + 1}</h4>
                                    <span className="phase-description">{phase.description}</span>
                                </div>
                                
                                <div className="phase-details">
                                    <div className="amount-input-group">
                                        <label>Payment Amount (ETH):</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            value={phaseAmounts[index] || 0}
                                            onChange={(e) => handleCustomAmountChange(index, e.target.value)}
                                            className="amount-input"
                                            disabled={phase.isPaid}
                                        />
                                    </div>
                                    
                                    <div className="phase-status">
                                        <span>Status: {phase.isPaid ? 'Paid ✓' : 'Pending'}</span>
                                    </div>
                                </div>

                                <div className="phase-actions">
                                    {!phase.isPaid ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handlePhasePayment(index)}
                                            disabled={
                                                paymentLoading[index] || 
                                                phaseAmounts[index] <= 0 ||
                                                !blockchain.contract
                                            }
                                        >
                                            {paymentLoading[index] 
                                                ? 'Processing...' 
                                                : `Pay ${phaseAmounts[index]?.toFixed(4) || 0} ETH`
                                            }
                                        </button>
                                    ) : (
                                        <button className="btn btn-success" disabled>
                                            Paid ✓
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-phases">
                        <p>No phases defined for this tender.</p>
                        <div className="single-payment">
                            <h4>Single Payment</h4>
                            <p>Total Amount: {bidAmount.toFixed(4)} ETH</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => handlePhasePayment(0)}
                                disabled={paymentLoading[0] || !blockchain.contract}
                            >
                                {paymentLoading[0] ? 'Processing...' : `Pay ${bidAmount.toFixed(4)} ETH`}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Rating Section - Only show when all phases are paid */}
            {areAllPhasesPaid() && !hasRated && (
                <div className="detail-section rating-section">
                    <h3>Rate the Bidder</h3>
                    <p>All payments have been completed successfully! Please rate the bidder's performance.</p>
                    
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${
                                    star <= (hoveredStar || rating) ? 'filled' : 'empty'
                                }`}
                                onClick={() => handleStarClick(star)}
                                onMouseEnter={() => handleStarHover(star)}
                                onMouseLeave={handleStarLeave}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    
                    <div className="rating-info">
                        <p>Selected Rating: {rating > 0 ? `${rating}/5` : 'None'}</p>
                    </div>
                    
                    <button
                        className="btn  submit-rating-btn"
                        onClick={submitRating}
                        disabled={rating === 0 || isSubmittingRating}
                    >
                        {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </div>
            )}

            {/* Show thank you message after rating */}
            {hasRated && (
                <div className="detail-section rating-section">
                    <h3>Thank You!</h3>
                    <p>Your rating has been submitted successfully. Thank you for your feedback!</p>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? 'filled' : 'empty'}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <p>You rated: {rating}/5</p>
                </div>
            )}

            <div className="form-actions">
                <Link to={`/tender-detail/${tenderId}`} className="btn btn-secondary">
                    Back to Tender Details
                </Link>
                <Link to="/all-tenders" className="btn btn-secondary">
                    Back to All Tenders
                </Link>
            </div>
        </div>
    );
};

export default PayBidder;