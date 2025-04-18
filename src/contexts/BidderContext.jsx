import React, { useState, createContext } from 'react';

// Mock data for initial development
const initialTenders = [
    {
        id: 1,
        title: "Office Supplies Procurement",
        description: "Supply of stationery and office consumables for Q1 2025",
        deadline: "2025-03-15",
        status: "Open",
        createdBy: "Ministry of Education",
        estimatedBudget: "10,000 - 15,000",
        category: "Supplies",
        documents: ["tender_specs.pdf", "terms_conditions.pdf"]
    },
    {
        id: 2,
        title: "IT Hardware Maintenance",
        description: "Annual maintenance contract for server infrastructure",
        deadline: "2025-03-10",
        status: "Open",
        createdBy: "Department of Health",
        estimatedBudget: "40,000 - 50,000",
        category: "Services",
        documents: ["maintenance_requirements.pdf", "sla_template.pdf"]
    },
    {
        id: 3,
        title: "Cafeteria Services",
        description: "Providing cafeteria services for 100 employees",
        deadline: "2025-02-28",
        status: "Closed",
        createdBy: "City Council",
        estimatedBudget: "30,000 - 40,000",
        category: "Food Services",
        documents: ["cafeteria_requirements.pdf"]
    }
];

// Mock user data
const mockBidderProfile = {
    id: 1001,
    name: "TechSolutions Inc.",
    email: "contact@techsolutions.example",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Tech City, TC 54321",
    registrationNumber: "BID-2025-1001",
    rating: 4.7,
    categories: ["IT Services", "Hardware", "Consultancy"],
    documents: ["company_profile.pdf", "tax_certificate.pdf", "registration.pdf"]
};

// Mock bids submitted by the current bidder
const initialMyBids = [
    {
        id: 101,
        tenderId: 1,
        tenderTitle: "Office Supplies Procurement",
        bidAmount: 12500,
        submissionDate: "2025-02-25",
        status: "Submitted", // Submitted, Shortlisted, Awarded, Rejected
        notes: "Included 5% discount on bulk orders"
    },
    {
        id: 102,
        tenderId: 2,
        tenderTitle: "IT Hardware Maintenance",
        bidAmount: 45000,
        submissionDate: "2025-02-20",
        status: "Shortlisted",
        notes: "24/7 support included in pricing"
    },
    {
        id: 103,
        tenderId: 3,
        tenderTitle: "Cafeteria Services",
        bidAmount: 35000,
        submissionDate: "2025-02-15",
        status: "Awarded",
        notes: "Organic food options included"
    }
];

// Create context
export const BidderContext = createContext();

export function BidderProvider({ children }) {
    const [tenders, setTenders] = useState(initialTenders);
    const [myBids, setMyBids] = useState(initialMyBids);
    const [profile, setProfile] = useState(mockBidderProfile);

    // Add a new bid
    const submitBid = (tenderId, bidData) => {
        const tender = tenders.find(t => t.id === tenderId);

        if (!tender) return false;

        const newBid = {
            id: Math.floor(Math.random() * 1000) + 200,
            tenderId: tenderId,
            tenderTitle: tender.title,
            bidAmount: bidData.bidAmount,
            submissionDate: new Date().toISOString().split('T')[0],
            status: "Submitted",
            notes: bidData.notes
        };

        setMyBids([...myBids, newBid]);
        return true;
    };

    // Update profile information
    const updateProfile = (newProfileData) => {
        setProfile({
            ...profile,
            ...newProfileData
        });
    };

    return (
        <BidderContext.Provider value={{
            tenders,
            myBids,
            profile,
            submitBid,
            updateProfile
        }}>
            {children}
        </BidderContext.Provider>
    );
}