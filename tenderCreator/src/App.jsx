import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateTender from './pages/CreateTender';
import AllTenders from './pages/AllTenders';
import AwardedTenders from './pages/AwardedTenders';
import TenderDetail from './pages/TenderDetail';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateTender />} />
            <Route path="/all-tenders" element={<AllTenders />} />
            <Route path="/awarded-tenders" element={<AwardedTenders />} />
            <Route path="/tender/:id" element={<TenderDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;