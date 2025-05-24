import React from 'react';
import { Link } from 'react-router-dom';

const TNavbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">Tender Management System</div>
            <ul className="navbar-nav">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/create">Create Tender</Link></li>
                <li><Link to="/all-tenders">All Tenders</Link></li>
                <li><Link to="/awarded-tenders">Awarded Tenders</Link></li>
            </ul>
        </nav>
    );
};

export default TNavbar;