import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, linkText, linkTo }) => {
    return (
        <div className="stat-card">
            <h3>{title}</h3>
            <p className="stat-value">{value}</p>
            <Link to={linkTo} className="stat-link">{linkText}</Link>
        </div>
    );
};

export default StatCard;