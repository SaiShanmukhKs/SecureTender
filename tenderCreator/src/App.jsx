import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TenderDetail from './pages/TenderDetail';
import SignUp from './pages/SignUp';
import { jwtDecode } from "jwt-decode";
import TDashboard from './pages/tenderCreator/TDashboard';
import CreateTender from './pages/tenderCreator/CreateTender';
import AllTenders from './pages/tenderCreator/AllTenders';
import AwardedTenders from './pages/tenderCreator/AwardedTenders';
import BDashboard from './pages/bidder/BDashboard';
import AvailableTenders from './pages/bidder/AvailableTenders';
import MyBids from './pages/bidder/MyBids';
import BidderProfile from './pages/bidder/BidderProfile';
import SubmitBid from './pages/bidder/SubmitBid';
// import Error from './Error';
import { BlockchainTenderingProvider } from './context/ContractContext.jsx';
import TNavbar from './components/TNavbar.jsx';
import BNavbar from './components/BNavbar.jsx';

const App = () => {
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const role = decodedToken ? decodedToken.role : null;

  return (
    <Router>
      {role === 'tenderCreator' && (
        <BlockchainTenderingProvider>
          <div className="app-container">
            <TNavbar />
            <div className="content">
              <Routes>
                <Route path="/dashboard" element={<TDashboard />} />
                <Route path="/create" element={<CreateTender />} />
                <Route path="/all-tenders" element={<AllTenders />} />
                <Route path="/awarded-tenders" element={<AwardedTenders />} />
                <Route path="/tender/:id" element={<TenderDetail />} />
              </Routes>
            </div>
          </div>
        </BlockchainTenderingProvider>
      )}

      {role === 'bidder' && (
        <BlockchainTenderingProvider>
          <div className="app-container">
            <BNavbar />
            <div className="content">
              <Routes>
                <Route path="/" element={<BDashboard />} />
                <Route path="/tenders" element={<AvailableTenders />} />
                <Route path="/tender/:id" element={<TenderDetail />} />
                <Route path="/my-bids" element={<MyBids />} />
                <Route path="/profile" element={<BidderProfile />} />
                <Route path="/submit-bid/:id" element={<SubmitBid />} />
              </Routes>
            </div>
          </div>
        </BlockchainTenderingProvider>
      )}
      <Routes>
        <Route path="/signup" exact element={<SignUp />} />
        <Route path="/" element={<Navigate replace to="/signup" />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;