import React, { createContext, useState } from 'react';
// import { initialTenders } from '../data/mockData';

export const TenderContext = createContext();

export const TenderProvider = ({ children }) => {
    const [tenders, setTenders] = useState(initialTenders);

    const addTender = (newTender) => {
        const tender = {
            ...newTender,
            id: tenders.length + 1,
            status: "Open",
            bidders: [],
            awardedTo: null
        };
        setTenders([...tenders, tender]);
    };

    const awardTender = (tenderId, bidderId) => {
        setTenders(
            tenders.map(tender =>
                tender.id === tenderId
                    ? { ...tender, status: "Awarded", awardedTo: bidderId }
                    : tender
            )
        );
    };

    const addMockBidders = (tenderId) => {
        const mockBidders = [
            { id: Math.floor(Math.random() * 1000), name: "Vendor A", bid: Math.floor(Math.random() * 10000) + 10000, rating: (Math.random() * 2) + 3 },
            { id: Math.floor(Math.random() * 1000), name: "Vendor B", bid: Math.floor(Math.random() * 10000) + 10000, rating: (Math.random() * 2) + 3 },
            { id: Math.floor(Math.random() * 1000), name: "Vendor C", bid: Math.floor(Math.random() * 10000) + 10000, rating: (Math.random() * 2) + 3 }
        ];

        setTenders(
            tenders.map(tender =>
                tender.id === tenderId
                    ? { ...tender, bidders: mockBidders }
                    : tender
            )
        );
    };

    return (
        <TenderContext.Provider value={{ tenders, addTender, awardTender, addMockBidders }}>
            {children}
        </TenderContext.Provider>
    );
};