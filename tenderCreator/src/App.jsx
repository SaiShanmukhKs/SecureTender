import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
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
import Error from './pages/Error';
import { BlockchainTenderingProvider } from './context/ContractContext.jsx';
import TNavbar from './components/TNavbar.jsx';
import BNavbar from './components/BNavbar.jsx';

const App = () => {
  let token = localStorage.getItem('userData');
  token = token ? JSON.parse(token).token : null;
  const decodedToken = token ? jwtDecode(token) : null;
  console.log("Decoded Token:", decodedToken);
  const role = decodedToken ? decodedToken.userResponse.role : null;

  return (
    <Router>
      <BlockchainTenderingProvider>
        <Routes>

          {/* Tender Creator Routes */}
          {role === 'tenderCreator' && (
            <>
              <Route path="/dashboard" element={<WithTNavbar><TDashboard /></WithTNavbar>} />
              <Route path="/create" element={<WithTNavbar><CreateTender /></WithTNavbar>} />
              <Route path="/all-tenders" element={<WithTNavbar><AllTenders /></WithTNavbar>} />
              <Route path="/awarded-tenders" element={<WithTNavbar><AwardedTenders /></WithTNavbar>} />
              <Route path="/tender/:id" element={<WithTNavbar><TenderDetail /></WithTNavbar>} />
            </>
          )}

          {/* Bidder Routes */}
          {role === 'bidder' && (
            <>
              <Route path="/dashboard" element={<WithBNavbar><BDashboard /></WithBNavbar>} />
              <Route path="/tenders" element={<WithBNavbar><AvailableTenders /></WithBNavbar>} />
              <Route path="/tender/:id" element={<WithBNavbar><TenderDetail /></WithBNavbar>} />
              <Route path="/my-bids" element={<WithBNavbar><MyBids /></WithBNavbar>} />
              <Route path="/profile" element={<WithBNavbar><BidderProfile /></WithBNavbar>} />
              <Route path="/submit-bid/:id" element={<WithBNavbar><SubmitBid /></WithBNavbar>} />
            </>
          )}

          {/* Common routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate replace to="/signup" />} />

          {/* Fallback route */}
          <Route path="*" element={<Error />} />
        </Routes>
      </BlockchainTenderingProvider>
    </Router>
  );
};

const WithTNavbar = ({ children }) => (
  <div className="app-container">
    <TNavbar />
    <div className="content">{children}</div>
  </div>
);

const WithBNavbar = ({ children }) => (
  <div className="app-container">
    <BNavbar />
    <div className="content">{children}</div>
  </div>
);

export default App;
