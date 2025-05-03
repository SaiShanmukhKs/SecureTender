import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BidderProvider } from './contexts/BidderContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AvailableTenders from './pages/AvailableTenders';
import TenderDetail from './pages/TenderDetail';
import MyBids from './pages/MyBids';
import BidderProfile from './pages/BidderProfile';
import SubmitBid from './pages/SubmitBid';
import { BlockchainTenderingProvider } from './contexts/ContractContext';

function App() {
  return (
    <BlockchainTenderingProvider>
      {/* <BidderProvider> */}
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tenders" element={<AvailableTenders />} />
              <Route path="/tender/:id" element={<TenderDetail />} />
              <Route path="/my-bids" element={<MyBids />} />
              <Route path="/profile" element={<BidderProfile />} />
              <Route path="/submit-bid/:id" element={<SubmitBid />} />
            </Routes>
          </div>
        </div>
      </Router>
      {/* </BidderProvider> */}
    </BlockchainTenderingProvider>
  );
}

export default App;