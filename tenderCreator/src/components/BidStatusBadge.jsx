import React from 'react';

const BidStatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
        switch(status.toLowerCase()) {
            case 'pending':
                return 'bid-status pending';
            case 'accepted':
                return 'bid-status accepted';
            case 'rejected':
                return 'bid-status rejected';
            default:
                return 'bid-status';
        }
    };

    const getStatusIcon = (status) => {
        switch(status.toLowerCase()) {
            case 'pending':
                return '⏳';
            case 'accepted':
                return '✅';
            case 'rejected':
                return '❌';
            default:
                return '';
        }
    };

    return (
        <span className={getStatusClass(status)}>
            <span className="bid-status-icon">{getStatusIcon(status)}</span>
            <span className="bid-status-text">{status}</span>
        </span>
    );
};

export default BidStatusBadge;