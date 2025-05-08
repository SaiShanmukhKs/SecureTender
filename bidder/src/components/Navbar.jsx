import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">Tender Bidding Portal</div>
            <ul className="navbar-nav">
                {/* <li><Link to="/">Dashboard</Link></li> */}
                <li><Link to="/">Available Tenders</Link></li>
                {/* <li><Link to="/tenders">Available Tenders</Link></li> */}
                <li><Link to="/my-bids">My Bids</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;