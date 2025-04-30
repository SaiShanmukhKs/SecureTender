import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useParams from '../hooks/useParams';
import { useBlockchainTendering } from '../context/ContractContext';
import StatusBadge from '../components/StatusBadge';

const TenderDetail = () => {
    const { getTenderDetails } = useBlockchainTendering();
    const navigate = useNavigate();
    const { id } = useParams();
    const tenderId = parseInt(id);
    const [tender, setTender] = useState(null);

    const getTender = async (tenderId) => {
        const tender = await getTenderDetails(tenderId); 
        setTender(tender);
    };

    useEffect(() => {
        getTender(tenderId);
    }, [tenderId]);

    console.log("Tender Details:", tender);

    if (!tender) {
        return <div>Loading tender details...</div>;
    }

    // Convert status from number to readable text
    const statusMapping = {
        0: "Open",
        1: "Closed",
        2: "Awarded",
        // add more statuses if needed
    };

    const formattedStartDate = new Date(Number(tender.startDate) * 1000).toLocaleDateString();
    const formattedEndDate = new Date(Number(tender.endDate) * 1000).toLocaleDateString();

    return (
        <div className="tender-detail">
            <h1>Tender Details</h1>

            <div className="tender-info">
                <h2>{tender.title}</h2>
                <p><strong>Status:</strong> <StatusBadge status={statusMapping[Number(tender.status)] || "Unknown"} /></p>
                <p><strong>Start Date:</strong> {formattedStartDate}</p>
                <p><strong>End Date:</strong> {formattedEndDate}</p>
                <p><strong>Request for Proposal (RFP):</strong> {tender.rfp}</p>
                <p><strong>Tender Fee:</strong> {Number(tender.tenderFee) / 1e18} ETH</p>
                <p><strong>Registration Fee:</strong> {Number(tender.registrationFee) / 1e18} ETH</p>
                <p><strong>Money Dispersal Phases:</strong> {Number(tender.moneyDispersalPhases)}</p>
                <p><strong>Created By:</strong> {tender.createdBy}</p>
                <p><strong>Bid Count:</strong> {Number(tender.bidCount)}</p>
                <p><strong>Winner:</strong> {tender.winner !== "0x0000000000000000000000000000000000000000" ? tender.winner : "No winner yet"}</p>
            </div>

            <div className="back-link" style={{ marginTop: '20px' }}>
                <Link to="/all-tenders">Back to All Tenders</Link>
            </div>
        </div>
    );
};

export default TenderDetail;
