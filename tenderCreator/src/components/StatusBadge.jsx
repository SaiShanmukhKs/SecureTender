import React from 'react';

const StatusBadge = ({ status }) => {
    return (
        <span className={`status ${status.toLowerCase()}`}>
            {status}
        </span>
    );
};

export default StatusBadge;